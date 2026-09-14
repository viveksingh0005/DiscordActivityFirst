import { useEffect, useState } from "react";

const CountdownTimer = ({ endsAt, onExpire }) => {
  const [secondsLeft, setSecondsLeft] = useState(() =>
    Math.max(0, Math.ceil((endsAt - Date.now()) / 1000))
  );

  useEffect(() => {
    // Recalculate immediately when endsAt changes (new phase started)
    setSecondsLeft(Math.max(0, Math.ceil((endsAt - Date.now()) / 1000)));

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
      setSecondsLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        onExpire?.();
      }
    }, 250); // 250ms tick keeps the display smooth without hammering re-renders

    return () => clearInterval(interval);
  }, [endsAt, onExpire]);

  return (
    <div className="countdown-timer" aria-live="polite">
      {secondsLeft}s
    </div>
  );
};

export default CountdownTimer;