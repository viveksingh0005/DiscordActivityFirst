import { useRoom } from "../context/RoomContext";
import { socket } from "../socket/socket";
import PlayerList from "./PlayerList";

const Lobby = () => {
  const { room, players, spectators, isHost } = useRoom();

  const handleStart = () => {
    socket.emit("startSession");
  };

  if (!room) {
    return <div className="lobby-loading">Connecting to room...</div>;
  }

  const canStart = isHost && players.length >= 2 && room.status === "lobby";

  return (
    <div className="lobby">
      <h2>Room Lobby</h2>

      <section>
        <h3>Players ({players.length}/{room.capacity})</h3>
        <PlayerList members={players} />
      </section>

      {spectators.length > 0 && (
        <section>
          <h3>Spectators ({spectators.length})</h3>
          <PlayerList members={spectators} />
        </section>
      )}

      {isHost ? (
        <button onClick={handleStart} disabled={!canStart}>
          {players.length < 2 ? "Waiting for players..." : "Start Session"}
        </button>
      ) : (
        <p>Waiting for host to start the session...</p>
      )}
    </div>
  );
};

export default Lobby;