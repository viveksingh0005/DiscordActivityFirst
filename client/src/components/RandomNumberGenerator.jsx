import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const RandomNumberGenerator = () => {
  // =========================
  // GAME STATE
  // =========================
  const navigate = useNavigate();
  const [numbers, setNumbers] = useState([]);
  const [letters, setLetters] = useState([]);

  const [timeLeft, setTimeLeft] = useState(10);
  const [isHidden, setIsHidden] = useState(false);

  const [targetSum, setTargetSum] = useState(null);

  const [selected, setSelected] = useState([]);

  const [gameResult, setGameResult] = useState(null);

  // Backend game ID
  const [gameId, setGameId] = useState(null);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Answer submission state
  const [checkingAnswer, setCheckingAnswer] = useState(false);

  // Error state
  const [error, setError] = useState("");

  // Points received from backend
  const [points, setPoints] = useState(null);


  // =========================
  // START GAME (standalone function so restartGame can call it too)
  // =========================

  const startGame = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      // Make sure user is logged in
      if (!token) {
        setError("You are not logged in.");
        setLoading(false);
        return;
      }

      const response = await fetch("/.proxy/api/game/start", {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("Game started:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to start game"
        );
      }

      // =========================
      // SAVE BACKEND GAME DATA
      // =========================

      setGameId(data.gameId);

      setNumbers(data.numbers);

      setTargetSum(data.targetSum);

      // A-P
      setLetters(
        "ABCDEFGHI".split("")
      );

      setLoading(false);

    } catch (error) {
      console.error(
        "Start game error:",
        error
      );

      setError(
        error.message ||
        "Failed to start game"
      );

      setLoading(false);
    }
  };

  useEffect(() => {
    startGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // =========================
  // COUNTDOWN TIMER
  // =========================

  useEffect(() => {
    // Don't start timer while loading
    if (loading) return;

    // Don't start if game didn't load
    if (!gameId) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {

        if (prev <= 1) {
          clearInterval(interval);

          // Hide numbers
          setIsHidden(true);

          return 0;
        }

        return prev - 1;
      });

    }, 1000);

    return () => {
      clearInterval(interval);
    };

  }, [loading, gameId]);


  // =========================
  // SELECT LETTER
  // =========================

  const handleSelect = (index) => {

    // Don't allow selection before
    // numbers disappear
    if (!isHidden) return;

    // Don't allow selection after result
    if (gameResult) return;

    // Don't allow selection while checking
    if (checkingAnswer) return;

    setSelected((prev) => {

      // If already selected
      // remove it
      if (prev.includes(index)) {

        return prev.filter(
          (i) => i !== index
        );
      }

      // Otherwise select it
      return [...prev, index];

    });
  };


  // =========================
  // CHECK ANSWER
  // =========================

  const checkAnswer = async () => {

    if (selected.length === 0) {
      return;
    }

    if (!gameId) {
      console.error("Game ID missing");
      return;
    }

    try {

      setCheckingAnswer(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("You are not logged in.");
        setCheckingAnswer(false);
        return;
      }

      // =========================
      // SEND ANSWER TO BACKEND
      // =========================

      const response = await fetch(
        "/.proxy/api/game/answer",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            gameId: gameId,

            selectedIndexes: selected,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Answer response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to check answer"
        );
      }

      // =========================
      // WIN
      // =========================

      if (data.result === "win") {

        setGameResult("win");

        // Backend returns total points
        setPoints(data.points);

      }

      // =========================
      // LOSE
      // =========================

      else {

        setGameResult("lose");

        // Still update total points
        if (
          data.points !== undefined
        ) {
          setPoints(data.points);
        }
      }

    } catch (error) {

      console.error(
        "Answer error:",
        error
      );

      setError(
        error.message ||
        "Failed to check answer"
      );

    } finally {

      setCheckingAnswer(false);
    }
  };




  const restartGame = () => {
    setIsHidden(false);
    setTargetSum(null);
    setSelected([]);
    setGameResult(null);
    setGameId(null);
    setPoints(null);
    setError("");
    setTimeLeft(10);
    setNumbers([]);
    setLetters([]);
    startGame();
  };


  // =========================
  // LOADING SCREEN
  // =========================

  if (loading) {

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center">

        <div className="text-center">

          <div className="text-4xl mb-4">
            🧠
          </div>

          <div className="text-2xl font-bold text-indigo-600">
            Starting game...
          </div>

          <p className="text-gray-500 mt-2">
            Preparing your memory challenge
          </p>

        </div>

      </div>
    );
  }


  // =========================
  // ERROR SCREEN
  // =========================

  if (error && !gameId) {

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-6">

        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">

          <div className="text-4xl mb-4">
            ❌
          </div>

          <h2 className="text-2xl font-bold text-red-600 mb-3">
            Unable to Start Game
          </h2>

          <p className="text-gray-600 mb-6">
            {error}
          </p>

          <button
            onClick={restartGame}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }


  // =========================
  // MAIN GAME UI
  // =========================

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex flex-col items-center justify-center p-6">

      {/* =========================
          HEADER
      ========================= */}

      <div className="text-center mb-6">

        <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Alpha Memory
        </h1>

        <p className="text-gray-600 text-lg">

          {isHidden
            ? "Select letters whose numbers add up to the target"
            : "Memorize the numbers before they disappear!"
          }

        </p>
 <button
          onClick={() => navigate("/")}
          className="px-6 py-2 rounded-xl text-gray-600 hover:bg-white/20 transition"
        >
          ← Back to Home
        </button>
      </div>


      {/* =========================
          ERROR MESSAGE
      ========================= */}

      {error && (
        <div className="mb-4 px-5 py-3 bg-red-100 border border-red-200 text-red-600 rounded-xl">
          {error}
        </div>
      )}


      {/* =========================
          TIMER
      ========================= */}

      {!isHidden && (

        <div className="mb-8">

          <div
            className={`
              relative
              w-28
              h-28
              rounded-full
              flex
              items-center
              justify-center
              shadow-xl
              border-4
              transition-all
              duration-300

              ${
                timeLeft <= 3
                  ? "border-red-400 bg-red-50 text-red-600 scale-110"
                  : "border-indigo-400 bg-white text-indigo-600"
              }
            `}
          >

            <span className="text-4xl font-bold tabular-nums">
              {timeLeft}
            </span>

            <span className="absolute -bottom-7 text-sm font-medium text-gray-500">
              seconds
            </span>

          </div>

        </div>

      )}

      


      {/* =========================
          TARGET SUM
      ========================= */}

      {isHidden && targetSum !== null && (

        <div className="mb-6 text-center">

          <p className="text-gray-600 mb-2 font-medium">
            Target Sum
          </p>

          <div className="inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-4xl font-bold rounded-2xl shadow-lg">

            {targetSum}

          </div>

        </div>

      )}


      {/* =========================
          SELECTED LETTERS
      ========================= */}

      {isHidden && selected.length > 0 && (

        <div className="mb-4 text-center">

          <p className="text-sm text-gray-500 mb-1">
            Selected:
          </p>

          <div className="flex gap-2 justify-center flex-wrap">

            {selected.map((idx) => (

              <span
                key={idx}
                className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-semibold"
              >
                {letters[idx]}
              </span>

            ))}

          </div>

        </div>

      )}


      {/* =========================
          NUMBER / LETTER GRID
      ========================= */}

      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-2xl border border-white/50">

        <div className="grid grid-cols-3 gap-3 md:gap-4">

          {Array.from({
            length: 9
          }).map((_, index) => {

            const isEven =
              (
                Math.floor(index / 3) +
                (index % 3)
              ) % 2 === 0;

            const isSelected =
              selected.includes(index);

            return (

              <div
                key={index}

                onClick={() =>
                  isHidden &&
                  handleSelect(index)
                }

                className={`
                  w-16
                  h-16
                  md:w-20
                  md:h-20
                  flex
                  items-center
                  justify-center
                  rounded-2xl
                  text-2xl
                  md:text-3xl
                  font-bold
                  shadow-md
                  transition-all
                  duration-300

                  ${
                    isHidden
                      ? "cursor-pointer hover:scale-105 active:scale-95"
                      : ""
                  }

                  ${
                    isHidden
                      ? isSelected
                        ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white ring-4 ring-yellow-300 scale-105"

                        : isEven
                        ? "bg-gradient-to-br from-emerald-400 to-teal-500 text-white"

                        : "bg-gradient-to-br from-white to-gray-50 text-teal-700 border border-teal-200"

                      : isEven
                      ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"

                      : "bg-gradient-to-br from-white to-gray-50 text-indigo-700 border border-indigo-100"
                  }
                `}
              >

                {isHidden
                  ? letters[index]
                  : numbers[index]
                }

              </div>

            );

          })}

        </div>

      </div>


      {/* =========================
          CHECK BUTTON / RESULT
      ========================= */}

      {isHidden && (

        <div className="mt-8 flex flex-col items-center gap-4">

          {!gameResult ? (

            <button
              onClick={checkAnswer}
              disabled={
                selected.length === 0 ||
                checkingAnswer
              }

              className={`
                px-8
                py-3
                rounded-xl
                font-semibold
                text-white
                text-lg
                shadow-lg
                transition-all

                ${
                  selected.length === 0 ||
                  checkingAnswer

                    ? "bg-gray-300 cursor-not-allowed"

                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-105"
                }
              `}
            >

              {checkingAnswer
                ? "Checking..."
                : "Check Answer"
              }

            </button>

          ) : (

            <div className="text-center">

              {/* =========================
                  WIN
              ========================= */}

              {gameResult === "win" ? (

                <div>

                  <div className="text-3xl font-bold text-green-600 mb-2">
                    🎉 You Win!
                  </div>

                  <div className="text-xl font-semibold text-indigo-600 mb-2">
                    +10 Points
                  </div>

                  {points !== null && (

                    <div className="text-gray-600 mb-4">
                      Total Points: {points}
                    </div>

                  )}

                </div>

              ) : (

                /* =========================
                   LOSE
                ========================= */

                <div>

                  <div className="text-3xl font-bold text-red-600 mb-2">
                    ❌ You Lose
                  </div>

                  {points !== null && (

                    <div className="text-gray-600 mb-4">
                      Total Points: {points}
                    </div>

                  )}

                </div>

              )}


              {/* PLAY AGAIN */}

              <button
                onClick={restartGame}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                Play Again
              </button>

            </div>

          )}

        </div>

      )}

    </div>
  );
};

export default RandomNumberGenerator;