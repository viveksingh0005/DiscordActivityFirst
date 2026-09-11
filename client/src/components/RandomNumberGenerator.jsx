import { useEffect, useState } from "react";

const RandomNumberGenerator = () => {
  const [numbers, setNumbers] = useState([]);
  const [letters, setLetters] = useState([]);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isHidden, setIsHidden] = useState(false);
  const [targetSum, setTargetSum] = useState(null)
  const [selected, setSelected] = useState([]);
  const [gameResult, setGameResult] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState(null);

  useEffect(() => {
  const startGame = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/game/start", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("Game started:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to start game");
      }

      // Store game ID
      setGameId(data.gameId);

      // Store numbers from backend
      setNumbers(data.numbers);

      // Store target from backend
      setTargetSum(data.targetSum);

      // Generate letters
      setLetters("ABCDEFGHIJKLMNOP".split(""));

      setLoading(false);

    } catch (error) {
      console.error("Start game error:", error);
      setLoading(false);
    }
  };

  startGame();
}, []);

useEffect(() => {
  if (loading) return;

  const interval = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        clearInterval(interval);
        setIsHidden(true);

        return 0;
      }

      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [loading]);
  // Toggle letter selection
  const handleSelect = (index) => {
    if (gameResult) return; // prevent selecting after result

    setSelected((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index); // deselect
      } else {
        return [...prev, index]; // select
      }
    });
  };

  // Check answer
 const checkAnswer = async () => {
  if (selected.length === 0) return;

  try {
    const token = localStorage.getItem("token");

    const response = await fetch("/api/game/answer", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        gameId,
        selectedIndexes: selected,
      }),
    });

    const data = await response.json();

    console.log("Answer response:", data);

    if (!response.ok) {
      throw new Error(data.message || "Failed to check answer");
    }

    if (data.result === "win"){
  <div className="text-center">
    <div className="text-3xl font-bold text-green-600 mb-2">
      🎉 You Win!
    </div>

    <div className="text-xl font-semibold text-indigo-600 mb-4">
      +10 Points
    </div>
     <div className="text-gray-600 mb-4">
      Total Points: {points}
    </div>
  </div>
} else {
      setGameResult("lose");
    }

  } catch (error) {
    console.error("Answer error:", error);
  }
};

  // Restart game
  const restartGame = () => {
    window.location.reload(); // simple restart
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex flex-col items-center justify-center p-6">
      
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Memory Game
        </h1>
        <p className="text-gray-600 text-lg">
          {isHidden
            ? "Select letters whose numbers add up to the target"
            : "Memorize the numbers before they disappear!"}
        </p>
      </div>

      {/* Timer */}
      {!isHidden && (
        <div className="mb-8">
          <div
            className={`relative w-28 h-28 rounded-full flex items-center justify-center shadow-xl border-4 transition-all duration-300
              ${timeLeft <= 3 ? "border-red-400 bg-red-50 text-red-600 scale-110" : "border-indigo-400 bg-white text-indigo-600"}`}
          >
            <span className="text-4xl font-bold tabular-nums">{timeLeft}</span>
            <span className="absolute -bottom-7 text-sm font-medium text-gray-500">seconds</span>
          </div>
        </div>
      )}

      {/* Target Sum */}
      {isHidden && targetSum && (
        <div className="mb-6 text-center">
          <p className="text-gray-600 mb-2 font-medium">Target Sum</p>
          <div className="inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-4xl font-bold rounded-2xl shadow-lg">
            {targetSum}
          </div>
        </div>
      )}

      {/* Selected Letters Preview */}
      {isHidden && selected.length > 0 && (
        <div className="mb-4 text-center">
          <p className="text-sm text-gray-500 mb-1">Selected:</p>
          <div className="flex gap-2 justify-center flex-wrap">
            {selected.map((idx) => (
              <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-semibold">
                {letters[idx]}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-2xl border border-white/50">
        <div className="grid grid-cols-4 gap-3 md:gap-4">
          {Array.from({ length: 16 }).map((_, index) => {
            const isEven = (Math.floor(index / 4) + (index % 4)) % 2 === 0;
            const isSelected = selected.includes(index);

            return (
              <div
                key={index}
                onClick={() => isHidden && handleSelect(index)}
                className={`
                  w-16 h-16 md:w-20 md:h-20 
                  flex items-center justify-center
                  rounded-2xl text-2xl md:text-3xl font-bold
                  shadow-md transition-all duration-300
                  ${isHidden ? "cursor-pointer hover:scale-105 active:scale-95" : ""}
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
                {isHidden ? letters[index] : numbers[index]}
              </div>
            );
          })}
        </div>
      </div>

      {/* Check Button + Result */}
      {isHidden && (
        <div className="mt-8 flex flex-col items-center gap-4">
          {!gameResult ? (
            <button
              onClick={checkAnswer}
              disabled={selected.length === 0}
              className={`px-8 py-3 rounded-xl font-semibold text-white text-lg shadow-lg transition-all
                ${selected.length === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-105"
                }`}
            >
              Check Answer
            </button>
          ) : (
            <div className="text-center">
              {gameResult === "win" ? (
                <div className="text-3xl font-bold text-green-600 mb-4">
                  🎉 You Win!
                </div>
              ) : (
                <div className="text-3xl font-bold text-red-600 mb-4">
                  ❌ You Lose
                </div>
              )}
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