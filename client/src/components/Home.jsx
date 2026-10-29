import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRoom } from "../context/RoomContext";

const Home = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const roomContext = useRoom();
    const room = roomContext?.room;
    const players = roomContext?.players || [];

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <div
            className="min-h-[100dvh] w-full flex items-center justify-center overflow-y-auto"
            style={{
                backgroundColor: "#120E27",
                backgroundImage:
                    "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
                backgroundSize: "22px 22px",
            }}
        >
            <div
                className="w-full flex flex-col items-center justify-center"
                style={{ padding: "clamp(1rem, 5vw, 2.5rem)" }}
            >
                <div
                    className="w-full flex flex-col items-center rounded-2xl"
                    style={{
                        maxWidth: "380px",
                        backgroundColor: "#1C1638",
                        border: "1px solid #322A57",
                        padding: "clamp(1.25rem, 6vw, 2.25rem)",
                    }}
                >
                    {/* Brand mark — reuses the same tile colors as the app icon */}
                    <div
                        className="grid grid-cols-2 mb-4"
                        style={{ gap: "clamp(6px, 3cqi, 10px)" }}
                        aria-hidden="true"
                    >
                        {[
                            { n: 7, bg: "#6366F1" },
                            { n: 14, bg: "#A855F7" },
                            { n: 9, bg: "#818CF8" },
                            { n: 3, bg: "#EC4899" },
                        ].map((t) => (
                            <div
                                key={t.n}
                                className="flex items-center justify-center rounded-md font-bold text-white"
                                style={{
                                    backgroundColor: t.bg,
                                    width: "clamp(24px, 11cqi, 36px)",
                                    height: "clamp(24px, 11cqi, 36px)",
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: "clamp(0.6rem, 4cqi, 0.8rem)",
                                }}
                            >
                                {t.n}
                            </div>
                        ))}
                    </div>

                    {/* Wordmark */}
                    <h1
                        className="text-center font-bold leading-none"
                        style={{
                            color: "#F4F2FF",
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontSize: "clamp(1.1rem, 11cqi, 2.35rem)",
                            letterSpacing: "-0.01em",
                        }}
                    >
                        Alpha Memory
                    </h1>


                    {/* User row — inline, no boxed card */}
                    {user && (
                        <div className="flex items-center gap-3 mb-7 w-full justify-center">
                            <div
                                className="rounded-full flex items-center justify-center font-bold text-white shrink-0 overflow-hidden"
                                style={{
                                    width: "clamp(36px, 10vw, 46px)",
                                    height: "clamp(36px, 10vw, 46px)",
                                    backgroundColor: "#6366F1",
                                    border: "2px solid #322A57",
                                }}
                            >
                                {user.avatar ? (
                                    <img
                                        src={`https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png`}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    (user.globalName || user.username || "U")[0].toUpperCase()
                                )}
                            </div>
                            <p
                                className="font-semibold truncate"
                                style={{
                                    color: "#F4F2FF",
                                    fontSize: "clamp(0.85rem, 3.2vw, 1rem)",
                                    maxWidth: "220px",
                                }}
                            >
                                {user.globalName || user.username}
                            </p>
                        </div>
                    )}

                    {/* Active Multiplayer Room Card (only shown when a multiplayer room has players) */}
                    {room && players.length > 0 && (
                        <div
                            className="w-full mb-5 p-3.5 rounded-xl flex flex-col gap-2.5 transition-all"
                            style={{
                                backgroundColor: "#241D45",
                                border: "1px solid #6366F1",
                                boxShadow: "0 0 12px rgba(99, 102, 241, 0.2)",
                            }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                                    </span>
                                    <span className="text-xs font-semibold tracking-wide text-indigo-300 uppercase">
                                        Multiplayer Room
                                    </span>
                                </div>
                                <span
                                    className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                                    style={{
                                        backgroundColor: room.status === "active" ? "#10B981" : "#8B5CF6",
                                        color: "#FFFFFF",
                                    }}
                                >
                                    {room.status === "active" ? "In Game 🎮" : "Lobby Waiting"}
                                </span>
                            </div>

                            {/* Player Avatars */}
                            <div className="flex items-center gap-2 overflow-x-auto py-1">
                                {players.map((p) => (
                                    <div
                                        key={p.discordId}
                                        className="relative shrink-0 flex items-center justify-center rounded-full font-bold text-white overflow-hidden"
                                        title={p.username}
                                        style={{
                                            width: "32px",
                                            height: "32px",
                                            backgroundColor: "#4F46E5",
                                            border: "1.5px solid #818CF8",
                                        }}
                                    >
                                        {p.avatar ? (
                                            <img
                                                src={`https://cdn.discordapp.com/avatars/${p.discordId}/${p.avatar}.png`}
                                                alt={p.username}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            (p.username || "P")[0].toUpperCase()
                                        )}
                                        {p.isHost && (
                                            <span
                                                className="absolute bottom-0 right-0 text-[8px] bg-amber-400 text-black font-extrabold px-0.5 rounded-full"
                                                title="Host"
                                            >
                                                ★
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() =>
                                    navigate(room.status === "active" ? "/gamemultiplayer" : "/lobby")
                                }
                                className="w-full py-1.5 rounded-lg text-xs font-semibold text-white transition-transform active:scale-[0.98]"
                                style={{
                                    backgroundColor: "#6366F1",
                                    boxShadow: "2px 2px 0 0 rgba(8,5,20,0.4)",
                                }}
                            >
                                {room.status === "active" ? "Spectate / View Game" : "Join Lobby"}
                            </button>
                        </div>
                    )}

                    {/* Actions — tactile pressed-tile buttons */}
                    <div className="flex flex-col gap-3 w-full">
                        <button
                            onClick={() => navigate("/game")}
                            className="w-full rounded-lg font-semibold text-white transition-transform motion-safe:active:translate-x-[3px] motion-safe:active:translate-y-[3px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                            style={{
                                backgroundColor: "#FF3E88",
                                padding: "clamp(0.75rem, 3.5vw, 1rem)",
                                fontSize: "clamp(0.95rem, 3.5vw, 1.05rem)",
                                boxShadow: "4px 4px 0 0 rgba(8,5,20,0.55)",
                            }}
                        >
                            Single Player
                        </button>
                        <button  onClick={() => navigate("/lobby")}
                            className="w-full rounded-lg font-semibold transition-transform motion-safe:active:translate-x-[3px] motion-safe:active:translate-y-[3px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                            style={{
                                backgroundColor: "#241D45",
                                color: "#F4F2FF",
                                border: "1px solid #322A57",
                                padding: "clamp(0.75rem, 3.5vw, 1rem)",
                                fontSize: "clamp(0.95rem, 3.5vw, 1.05rem)",
                                boxShadow: "4px 4px 0 0 rgba(8,5,20,0.4)",
                            }}  >
                            Multiplayer Lobby
                        </button>

                        <button
                            onClick={() => navigate("/profile")}
                            className="w-full rounded-lg font-semibold transition-transform motion-safe:active:translate-x-[3px] motion-safe:active:translate-y-[3px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                            style={{
                                backgroundColor: "#241D45",
                                color: "#F4F2FF",
                                border: "1px solid #322A57",
                                padding: "clamp(0.75rem, 3.5vw, 1rem)",
                                fontSize: "clamp(0.95rem, 3.5vw, 1.05rem)",
                                boxShadow: "4px 4px 0 0 rgba(8,5,20,0.4)",
                            }}
                        >
                            Profile
                        </button>

                        <button
                            onClick={() => navigate("/leaderboard")}
                            className="w-full rounded-lg font-semibold transition-transform motion-safe:active:translate-x-[3px] motion-safe:active:translate-y-[3px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                            style={{
                                backgroundColor: "#241D45",
                                color: "#FFB238",
                                border: "1px solid #3D3260",
                                padding: "clamp(0.75rem, 3.5vw, 1rem)",
                                fontSize: "clamp(0.95rem, 3.5vw, 1.05rem)",
                                boxShadow: "4px 4px 0 0 rgba(8,5,20,0.4)",
                            }}
                        >
                            Leaderboard
                        </button>
                    </div>

                    {/* Footer */}
                    <div
                        className="w-full mt-7 pt-4 text-center"
                        style={{ borderTop: "1px solid #241D45" }}
                    >
                        <p style={{ color: "#524783", fontSize: "0.7rem" }}>
                            © 2026 Alpha Memory
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;