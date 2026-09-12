import { Routes, Route, useNavigate } from "react-router-dom";
import RandomNumberGenerator from "./components/RandomNumberGenerator";
import Home from "./components/Home";
import { useEffect, useState } from "react";
import { initializeDiscord } from "./discordSdk";
import Profile from "./components/Profile";
import Leaderboard from "./components/Leaderboard";
import Terms from "./footer/Terms";
import Privacy from "./footer/Privacy";
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
      <div style={{ textAlign: "center", padding: "40px" }}>
        <p>Connecting to Discord...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game" element={<RandomNumberGenerator />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
    </Routes>
  );
}

export default App;