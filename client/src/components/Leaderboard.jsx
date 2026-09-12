import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Leaderboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("You are not logged in.");
          setLoading(false);
          return;
        }

        const response = await fetch("/.proxy/api/user/leaderboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load leaderboard");
        }

        setData(result);
        setLoading(false);

      } catch (err) {
        console.error("Leaderboard fetch error:", err);
        setError(err.message || "Failed to load leaderboard");
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-fuchsia-900 flex items-center justify-center">
        <p className="text-white/80 text-lg animate-pulse">Loading leaderboard...</p>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-fuchsia-900 flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-white text-lg text-center">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition"
        >
          ← Back to Home
        </button>
      </div>
    );
  }

  const medalFor = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  // =========================
  // MAIN UI
  // =========================
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-fuchsia-900 p-4 relative overflow-hidden">

      {/* Decorative glow */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

      <div className="relative z-10 max-w-md mx-auto py-4">

        <button
          onClick={() => navigate("/")}
          className="text-purple-200/70 hover:text-white transition mb-4 text-sm flex items-center gap-1"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold text-white text-center mb-6">
          🏆 Leaderboard
        </h1>

        {/* My rank card */}
        <div className="backdrop-blur-xl bg-gradient-to-r from-indigo-500/30 to-purple-500/30 border border-white/20 rounded-2xl p-5 mb-6 flex items-center justify-between">
          <div>
            <p className="text-purple-200/70 text-xs uppercase tracking-wide">Your Rank</p>
            <p className="text-3xl font-extrabold text-white">#{data.myRank}</p>
          </div>
          <div className="text-right">
            <p className="text-purple-200/70 text-xs uppercase tracking-wide">Points</p>
            <p className="text-2xl font-bold text-white">{data.myPoints}</p>
          </div>
        </div>

        {/* Top 10 list */}
        <div className="flex flex-col gap-2 pb-6">
          {data.topPlayers.map((player) => (
            <div
              key={player.rank}
              className="flex items-center gap-3 backdrop-blur-xl bg-white/10 border border-white/10 rounded-2xl p-3 hover:bg-white/[0.15] transition"
            >
              <div className="w-8 text-center font-bold text-white/90 text-lg">
                {medalFor(player.rank) || player.rank}
              </div>

              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0">
                {player.avatar ? (
                  <img
                    src={`https://cdn.discordapp.com/avatars/${player.discordId}/${player.avatar}.png`}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  (player.globalName || player.username || "U")[0].toUpperCase()
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">
                  {player.globalName || player.username}
                </p>
                <p className="text-purple-200/50 text-xs truncate">
                  {player.gamesWon}/{player.gamesPlayed} won
                </p>
              </div>

              <div className="text-right flex-shrink-0">
                <p className="text-white font-bold">{player.points}</p>
                <p className="text-purple-200/60 text-xs">pts</p>
              </div>
            </div>
          ))}

          {data.topPlayers.length === 0 && (
            <p className="text-center text-purple-200/60 mt-8">
              No players yet — be the first to score!
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Leaderboard;