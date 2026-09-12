import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex flex-col items-center justify-center p-6">

      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
        Memory Game
      </h1>

      {user && (
        <p className="text-xl text-gray-700 mb-8">
          Welcome, <span className="font-semibold">{user.globalName || user.username}</span>
        </p>
      )}

      <div className="flex flex-col gap-4 w-64">
        <button
          onClick={() => navigate("/game")}
          className="px-8 py-4 rounded-xl font-semibold text-white text-lg shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-105 transition-all"
        >
          Play
        </button>

        <button
          disabled
          className="px-8 py-4 rounded-xl font-semibold text-gray-400 text-lg shadow-md bg-gray-200 cursor-not-allowed"
        >
          Leaderboard (Coming Soon)
        </button>
      </div>

    </div>
  );
};

export default Home;