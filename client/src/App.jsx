import { Routes, Route, useNavigate } from "react-router-dom";
import RandomNumberGenerator from "./components/RandomNumberGenerator";
import Home from "./components/Home";
import { useEffect, useState } from "react";
import { initializeDiscord } from "./discordSdk";

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
    </Routes>
  );
}

export default App;