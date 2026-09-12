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
        <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-fuchsia-900 flex items-center justify-center p-4 relative overflow-hidden">

            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

            {/* Main Card */}
            <div className="relative z-10 w-full max-w-md">
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 md:p-10">

                    {/* Header */}
                    <div className="text-center mb-10">


                        <p className="text-purple-200/80 text-sm md:text-base">
                            Alpha Memory
                        </p>
                    </div>

                    {/* User Welcome */}
                    {user && (
                        <div className="flex items-center gap-3 bg-white/10 rounded-2xl p-3 mb-8 border border-white/10">
                            {/* Avatar */}
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md overflow-hidden">
                                {user.avatar ? (
                                    <img
                                        src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
                                        alt="avatar"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    (user.globalName || user.username || "U")[0].toUpperCase()
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-white font-semibold truncate">
                                    {user.globalName || user.username}
                                </p>
                                <p className="text-purple-200/70 text-sm truncate">
                                    @{user.username}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                        {/* Play Button */}
                        <button
                            onClick={() => navigate("/game")}
                            className="group relative w-full py-4 rounded-2xl font-semibold text-white text-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span className="relative flex items-center justify-center gap-2">
                                ▶ Play Now
                            </span>
                        </button>

                        {/* Profile Button */}
                        <button
                            onClick={() => navigate("/profile")}
                            className="w-full py-4 rounded-2xl font-semibold text-white text-lg bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            👤 Profile
                        </button>

                        {/* Leaderboard Button */}
                        {/* Leaderboard Button */}
                        <button
                            onClick={() => navigate("/leaderboard")}
                            className="w-full py-4 rounded-2xl font-semibold text-white text-lg bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            🏆 Leaderboard
                        </button>
                    </div>



                </div>
            </div>
        </div>
    );
};

export default Home;