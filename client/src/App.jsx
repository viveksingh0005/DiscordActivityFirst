import { Routes, Route, useNavigate } from "react-router-dom";
import RandomNumberGenerator from "./components/RandomNumberGenerator";
import Home from "./components/Home";
import { useEffect, useState } from "react";
import { initializeDiscord } from "./discordSdk";
import Profile from "./components/Profile";
import Leaderboard from "./components/Leaderboard";
import Lobby from "./components/Lobby";
import { RoomProvider } from "./context/RoomContext";
console.error("🔥🔥🔥 APP.JSX LOADED - BUILD CHECK 🔥🔥🔥");
function App() {
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    initializeDiscord()
      .then(() => setAuthReady(true))
      .catch((err) => {
        console.error("Discord init failed:", err);
        setAuthError(err.message || "Failed to connect to Discord");
      });
  }, []);

  if (authError) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h2>Unable to connect</h2>
        <p>{authError}</p>
      </div>
    );
  }

  if (!authReady) {
    return (
      <div
        className="min-h-[100dvh] w-full flex items-center justify-center"
        style={{
          backgroundColor: "#120E27",
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      >
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-2 gap-2 mb-5" aria-hidden="true">
            {["#6366F1", "#A855F7", "#818CF8", "#EC4899"].map((bg, i) => (
              <div
                key={i}
                className="rounded-md motion-safe:animate-pulse"
                style={{
                  backgroundColor: bg,
                  width: "30px",
                  height: "30px",
                  animationDelay: `${i * 150}ms`,
                  animationDuration: "1.1s",
                }}
              />
            ))}
          </div>
          <p
            style={{
              color: "#A79BD1",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.8rem",
              letterSpacing: "0.02em",
            }}
          >
            Connecting to Discord
          </p>
        </div>
      </div>
    );
  }

  return (
    <RoomProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<RandomNumberGenerator />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/lobby" element={<Lobby />} />

      </Routes>
    </RoomProvider>
  );
}

export default App;