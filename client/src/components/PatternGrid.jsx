const PatternGrid = ({ phase, highlightedIndexes, selectedIndexes, onSelect, disabled }) => {
  // phase: "showing" | "guessing" | "result"
  const boxes = Array.from({ length: 16 }, (_, i) => i);

  const getBoxClass = (index) => {
    const base =
      "aspect-square rounded-xl border-2 transition-all duration-200 ease-out " +
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 " +
      "disabled:cursor-not-allowed";

    // Default idle look
    let state =
      "bg-zinc-800/80 border-zinc-700 shadow-inner hover:border-zinc-500 hover:bg-zinc-700/80 active:scale-95";

    if (phase === "showing" && highlightedIndexes.includes(index)) {
      state =
        "bg-indigo-500 border-indigo-300 shadow-lg shadow-indigo-500/50 scale-105 ring-2 ring-indigo-300/60";
    }

    if (phase === "guessing" && selectedIndexes.includes(index)) {
      state =
        "bg-violet-500 border-violet-300 shadow-lg shadow-violet-500/40 scale-105 ring-2 ring-violet-300/50";
    }

    if (phase === "result") {
      const wasCorrectBox = highlightedIndexes.includes(index);
      const wasSelected = selectedIndexes.includes(index);

      if (wasCorrectBox && wasSelected) {
        // Correct pick
        state =
          "bg-emerald-500 border-emerald-300 shadow-lg shadow-emerald-500/40 scale-105 ring-2 ring-emerald-300/50";
      } else if (wasCorrectBox && !wasSelected) {
        // Missed
        state =
          "bg-amber-500/90 border-amber-300 shadow-md shadow-amber-500/30 opacity-90";
      } else if (!wasCorrectBox && wasSelected) {
        // Wrong pick
        state =
          "bg-rose-500 border-rose-300 shadow-lg shadow-rose-500/40 scale-105 ring-2 ring-rose-300/40";
      } else {
        // Neutral leftover boxes
        state = "bg-zinc-800/60 border-zinc-700/80 opacity-60";
      }
    }

    // Soften hover when not interactive
    if (disabled || phase !== "guessing") {
      state += " hover:scale-100 hover:border-zinc-700 hover:bg-zinc-800/80";
    }

    return `${base} ${state}`;
  };

  const handleClick = (index) => {
    if (disabled || phase !== "guessing") return;
    onSelect(index);
  };

  return (
    <div className="mx-auto grid w-full max-w-xs grid-cols-4 gap-2.5 sm:max-w-sm sm:gap-3">
      {boxes.map((index) => (
        <button
          key={index}
          className={getBoxClass(index)}
          onClick={() => handleClick(index)}
          disabled={disabled || phase !== "guessing"}
          aria-label={`Box ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default PatternGrid;