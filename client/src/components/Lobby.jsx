import { useRoom } from "../context/RoomContext";
import { socket } from "../socket/socket";
import PlayerList from "./PlayerList";

const Lobby = () => {
  const { room, players, spectators, isHost } = useRoom();

  const handleStart = () => {
    socket.emit("startSession");
  };

  if (!room) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 text-zinc-400">
        <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-zinc-700 border-t-indigo-500" />
        <p className="text-sm">Connecting to room...</p>
      </div>
    );
  }

  const canStart = isHost && players.length >= 2 && room.status === "lobby";
  const spotsLeft = room.capacity - players.length;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl shadow-black/40">
      {/* Header */}
      <header className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-100">
          Room Lobby
        </h2>
        <span className="rounded-full border border-zinc-700 bg-zinc-800 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-zinc-400">
          Waiting
        </span>
      </header>

      {/* Players */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-850/50 bg-zinc-800/40 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Players
          </h3>
          <span className="tabular-nums text-sm font-semibold text-zinc-200">
            {players.length}
            <span className="font-medium text-zinc-500"> / {room.capacity}</span>
          </span>
        </div>

        <PlayerList members={players} />

        {spotsLeft > 0 && (
          <p className="mt-2.5 text-xs text-zinc-500">
            {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} remaining
          </p>
        )}
      </section>

      {/* Spectators */}
      {spectators.length > 0 && (
        <section className="rounded-xl border border-zinc-800 bg-zinc-800/30 p-4 opacity-90">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Spectators
            </h3>
            <span className="tabular-nums text-sm font-semibold text-zinc-200">
              {spectators.length}
            </span>
          </div>
          <PlayerList members={spectators} />
        </section>
      )}

      {/* Footer / Start */}
      <footer className="mt-1">
        {isHost ? (
          <button
            onClick={handleStart}
            disabled={!canStart}
            className="w-full rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500 hover:shadow-indigo-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400 disabled:shadow-none disabled:active:scale-100"
          >
            {players.length < 2 ? "Waiting for players..." : "Start Session"}
          </button>
        ) : (
          <p className="py-3 text-center text-sm text-zinc-500">
            Waiting for host to start the session...
          </p>
        )}
      </footer>
    </div>
  );
};

export default Lobby;