import { useEffect, useState } from "react";
import { socket } from "../socket/socket";
import { useRoom } from "../context/RoomContext";
import PatternGrid from "./PatternGrid";
import CountdownTimer from "./CountDownTimer";
const [finalLeaderboard, setFinalLeaderboard] = useState(null);
const PatternGame = () => {
  const { players } = useRoom();

  const [phase, setPhase] = useState("waiting"); // waiting | showing | guessing | result
  const [highlightedIndexes, setHighlightedIndexes] = useState([]);
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [roundNumber, setRoundNumber] = useState(0);
  const [phaseEndsAt, setPhaseEndsAt] = useState(null); // server timestamp, for CountdownTimer
  const [roundResult, setRoundResult] = useState(null); // per-player scores, correct pattern
  const navigate = useNavigate();

  useEffect(() => {
    const onSessionEnded = (data) => setFinalLeaderboard(data.leaderboard);
    socket.on("sessionEnded", onSessionEnded);
    return () => socket.off("sessionEnded", onSessionEnded);
  }, []);
  useEffect(() => {
    // Server broadcasts the pattern only during this brief window
    const onShowPattern = (data) => {
      setRoundNumber(data.roundNumber);
      setHighlightedIndexes(data.pattern);
      setSelectedIndexes([]);
      setRoundResult(null);
      setPhaseEndsAt(data.phaseEndsAt);
      setPhase("showing");
    };

    // Server clears the pattern from view and opens guessing
    const onHidePattern = (data) => {
      setHighlightedIndexes([]); // critical: don't keep the answer in state during guessing
      setPhaseEndsAt(data.phaseEndsAt);
      setPhase("guessing");
    };

    // Server sends the real pattern back only now, along with everyone's scores
    const onRoundResult = (data) => {
      setHighlightedIndexes(data.correctPattern);
      setRoundResult(data.scores); // e.g. [{ discordId, selected, correctCount, points }]
      setPhase("result");
    };

    socket.on("showPattern", onShowPattern);
    socket.on("hidePattern", onHidePattern);
    socket.on("roundResult", onRoundResult);

    return () => {
      socket.off("showPattern", onShowPattern);
      socket.off("hidePattern", onHidePattern);
      socket.off("roundResult", onRoundResult);
    };
  }, []);

  const toggleBox = (index) => {
    setSelectedIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleSubmit = () => {
    // Server validates timing + computes correctness — client just sends the guess
    socket.emit("submitGuess", { roundNumber, selectedIndexes });
  };

  return (
    <div className="pattern-game">
      <h2>Round {roundNumber}</h2>

      {phaseEndsAt && <CountdownTimer endsAt={phaseEndsAt} />}

      <PatternGrid
        phase={phase}
        highlightedIndexes={highlightedIndexes}
        selectedIndexes={selectedIndexes}
        onSelect={toggleBox}
        disabled={phase !== "guessing"}
      />

      {phase === "guessing" && (
        <button onClick={handleSubmit}>Submit Guess</button>
      )}

      {phase === "result" && roundResult && (
        <div className="round-result">
          {roundResult.map((r) => (
            <p key={r.discordId}>
              {r.username}: {r.correctCount}/{highlightedIndexes.length} correct — +{r.points} pts
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatternGame;