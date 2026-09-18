import { useEffect, useState } from "react";
import { socket } from "../socket/socket";
import { useRoom } from "../context/RoomContext";
import PatternGrid from "./PatternGrid";
import CountdownTimer from "./CountDownTimer";

const PatternGame = () => {
  const { players } = useRoom();
  const [finalLeaderboard, setFinalLeaderboard] = useState(null);
  const [phase, setPhase] = useState("waiting"); 
  const [highlightedIndexes, setHighlightedIndexes] = useState([]);
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [roundNumber, setRoundNumber] = useState(0);
  const [phaseEndsAt, setPhaseEndsAt] = useState(null); 
  const [roundResult, setRoundResult] = useState(null); 
 

  useEffect(() => {
    const onSessionEnded = (data) => setFinalLeaderboard(data.leaderboard);
    socket.on("sessionEnded", onSessionEnded);
    return () => socket.off("sessionEnded", onSessionEnded);
  }, []);
  useEffect(() => {
   
    const onShowPattern = (data) => {
      setRoundNumber(data.roundNumber);
      setHighlightedIndexes(data.pattern);
      setSelectedIndexes([]);
      setRoundResult(null);
      setPhaseEndsAt(data.phaseEndsAt);
      setPhase("showing");
    };

    
    const onHidePattern = (data) => {
      setHighlightedIndexes([]); 
      setPhaseEndsAt(data.phaseEndsAt);
      setPhase("guessing");
    };

   
    const onRoundResult = (data) => {
      setHighlightedIndexes(data.correctPattern);
      setRoundResult(data.scores); 
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