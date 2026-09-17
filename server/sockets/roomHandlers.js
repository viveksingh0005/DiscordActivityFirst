import {
  findOrCreateRoom,
  markDisconnected,
  removeMember,
  serializeRoom,
} from "../services/roomService.js";
import Room from "../models/Room.js";
import { startPatternSession } from "../services/patternService.js";
const GRACE_PERIOD_MS = 45000; 
const MIN_PLAYERS_TO_START = 2;


const pendingRemovals = new Map();

export const registerRoomHandlers = (io, socket) => {
  const { instanceId, discordId, username, avatar } = socket.data;

  const joinRoom = async () => {
   
   
    if (pendingRemovals.has(discordId)) {
      clearTimeout(pendingRemovals.get(discordId));
      pendingRemovals.delete(discordId);
    }

    const room = await findOrCreateRoom({
      instanceId,
      discordId,
      username,
      avatar,
      socketId: socket.id,
    });

    io.to(instanceId).emit("roomUpdate", serializeRoom(room));
  };

  const handleStartSession = async () => {
    const room = await Room.findOne({ instanceId });
    if (!room) return;

    // Server-side re-validation — never trust the client's disabled-button state
    if (room.hostId !== discordId) {
      return socket.emit("errorMessage", { message: "Only the host can start the session." });
    }
    if (room.players.length < MIN_PLAYERS_TO_START) {
      return socket.emit("errorMessage", { message: "Need at least 2 players to start." });
    }
    if (room.status !== "lobby") {
      return; // already active or idle, ignore duplicate start
    }

    room.status = "active";
    room.lastActivityAt = new Date();
    await room.save();

    io.to(instanceId).emit("roomUpdate", serializeRoom(room));
    io.to(instanceId).emit("sessionStarting"); 
    startPatternSession(io, instanceId);
  };

  const handleDisconnect = async () => {
    const result = await markDisconnected({ socketId: socket.id });
    if (!result || !result.room) return;

    const { room } = result;
    io.to(instanceId).emit("roomUpdate", serializeRoom(room));

    // Give them GRACE_PERIOD_MS to reconnect before actually removing them
    const timer = setTimeout(async () => {
      const updatedRoom = await removeMember({ roomId: room._id, discordId });
      pendingRemovals.delete(discordId);

      if (updatedRoom) {
        io.to(instanceId).emit("roomUpdate", serializeRoom(updatedRoom));
      }
    }, GRACE_PERIOD_MS);

    pendingRemovals.set(discordId, timer);
  };

  joinRoom();

  socket.on("startSession", handleStartSession);
  socket.on("disconnect", handleDisconnect);
};