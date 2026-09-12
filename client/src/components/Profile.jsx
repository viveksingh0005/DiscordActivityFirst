import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("You are not logged in.");
          setLoading(false);
          return;
        }

        const response = await fetch("/.proxy/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load profile");
        }

        setProfile(data);
        setLoading(false);

      } catch (err) {
        console.error("Profile fetch error:", err);
        setError(err.message || "Failed to load profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const winRate =
    profile && profile.gamesPlayed > 0
      ? Math.round((profile.gamesWon / profile.gamesPlayed) * 100)
      : 0;

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-fuchsia-900 flex items-center justify-center">
        <p className="text-white/80 text-lg animate-pulse">Loading profile...</p>
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

  // =========================
  // MAIN UI
  // =========================
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-fuchsia-900 flex items-center justify-center p-4 relative overflow-hidden">

      {/* Decorative glow */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-4 md:p-10">

          {/* Back button */}
          <button
            onClick={() => navigate("/")}
            className="text-purple-200/70 hover:text-white transition mb-3 text-sm flex items-center gap-1"
          >
            ← Back
          </button>

          {/* Avatar + Name */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg overflow-hidden mb-4 ring-2 ring-white/20">
              {profile.avatar ? (
                <img
                  src={`https://cdn.discordapp.com/avatars/${profile.discordId}/${profile.avatar}.png`}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                (profile.globalName || profile.username || "U")[0].toUpperCase()
              )}
            </div>
            <p className="text-white font-bold text-xl">
              {profile.globalName || profile.username}
            </p>
            <p className="text-purple-200/60 text-sm">@{profile.username}</p>
          </div>

          {/* Total Score - big highlight */}
          <div className="bg-gradient-to-r from-indigo-500/30 to-purple-500/30 border border-white/20 rounded-2xl p-6 text-center mb-6">
            <p className="text-purple-200/70 text-sm uppercase tracking-wide mb-1">
              Total Score
            </p>
            <p className="text-5xl font-extrabold text-white">
              {profile.totalScore}
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white/10 rounded-2xl p-4 text-center border border-white/10">
              <p className="text-2xl font-bold text-white">{profile.gamesPlayed}</p>
              <p className="text-purple-200/70 text-xs mt-1">Games Played</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 text-center border border-white/10">
              <p className="text-2xl font-bold text-white">{profile.gamesWon}</p>
              <p className="text-purple-200/70 text-xs mt-1">Games Won</p>
            </div>
          </div>

          {/* Win rate bar */}
          <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-purple-200/70">Win Rate</span>
              <span className="text-white font-semibold">{winRate}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full transition-all duration-500"
                style={{ width: `${winRate}%` }}
              ></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;