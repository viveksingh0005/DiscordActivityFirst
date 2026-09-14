const PatternGrid = ({ phase, highlightedIndexes, selectedIndexes, onSelect, disabled }) => {
  // phase: "showing" | "guessing" | "result"
  const boxes = Array.from({ length: 16 }, (_, i) => i);

  const getBoxClass = (index) => {
    const classes = ["pattern-box"];

    if (phase === "showing" && highlightedIndexes.includes(index)) {
      classes.push("highlighted");
    }

    if (phase === "guessing" && selectedIndexes.includes(index)) {
      classes.push("selected");
    }

    if (phase === "result") {
      const wasCorrectBox = highlightedIndexes.includes(index);
      const wasSelected = selectedIndexes.includes(index);

      if (wasCorrectBox && wasSelected) classes.push("correct");
      else if (wasCorrectBox && !wasSelected) classes.push("missed");
      else if (!wasCorrectBox && wasSelected) classes.push("wrong");
    }

    return classes.join(" ");
  };

  const handleClick = (index) => {
    if (disabled || phase !== "guessing") return;
    onSelect(index);
  };

  return (
    <div className="pattern-grid">
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