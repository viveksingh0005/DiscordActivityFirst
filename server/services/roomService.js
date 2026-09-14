import Room from "../models/Room.js";

// Finds a room by Discord instanceId, creating it if this is the first person to join
export const findOrCreateRoom = async ({ instanceId, discordId, username, avatar, socketId }) => {
  let room = await Room.findOne({ instanceId });

  if (!room) {
    room = await Room.create({
      instanceId,
      hostId: discordId,
      players: [{ discordId, username, avatar, socketId, connected: true }],
      spectators: [],
      status: "lobby",
    });
    return room;
  }

  return addMember({ room, discordId, username, avatar, socketId });
};

// Adds a joining user as a player (if capacity allows) or a spectator otherwise.
// Also handles the case where this discordId is already in the room (e.g. page refresh).
export const addMember = async ({ room, discordId, username, avatar, socketId }) => {
  const existingPlayer = room.players.find((p) => p.discordId === discordId);
  const existingSpectator = room.spectators.find((s) => s.discordId === discordId);

  if (existingPlayer) {
    existingPlayer.socketId = socketId;
    existingPlayer.connected = true;
    existingPlayer.disconnectedAt = null;
  } else if (existingSpectator) {
    existingSpectator.socketId = socketId;
    existingSpectator.connected = true;
    existingSpectator.disconnectedAt = null;
  } else if (room.players.length < room.capacity && room.status === "lobby") {
    // Only add as an active player if the room hasn't started yet — mid-round joiners
    // go straight to spectator regardless of capacity (handled below)
    room.players.push({ discordId, username, avatar, socketId, connected: true });
  } else {
    room.spectators.push({ discordId, username, avatar, socketId, connected: true });
  }

  room.lastActivityAt = new Date();
  await room.save();
  return room;
};

// Called on socket disconnect — marks the member as disconnected but does NOT remove them yet,
// so the grace-period reconnect logic (handled elsewhere via a timeout) has a chance to run
export const markDisconnected = async ({ socketId }) => {
  const room = await Room.findOne({
    $or: [{ "players.socketId": socketId }, { "spectators.socketId": socketId }],
  });

  if (!room) return null;

  const member =
    room.players.find((p) => p.socketId === socketId) ||
    room.spectators.find((s) => s.socketId === socketId);

  if (member) {
    member.connected = false;
    member.disconnectedAt = new Date();
    await room.save();
  }

  return { room, member };
};

// Called after the grace period expires with no reconnect — actually removes the member
// and runs host-transfer / spectator-promotion as needed
export const removeMember = async ({ roomId, discordId }) => {
  const room = await Room.findById(roomId);
  if (!room) return null;

  const wasHost = room.hostId === discordId;
  const wasPlayer = room.players.some((p) => p.discordId === discordId);

  room.players = room.players.filter((p) => p.discordId !== discordId);
  room.spectators = room.spectators.filter((s) => s.discordId !== discordId);

  // Promote the longest-waiting spectator to fill the open player slot
  if (wasPlayer && room.status === "lobby" && room.spectators.length > 0) {
    const promoted = room.spectators.shift();
    room.players.push(promoted);
  }

  // Host transfer: give it to the oldest remaining player
  if (wasHost && room.players.length > 0) {
    room.hostId = room.players[0].discordId;
  }

  // No one left at all — mark idle so the cleanup sweep can pick it up
  if (room.players.length === 0 && room.spectators.length === 0) {
    room.status = "idle";
  }

  room.lastActivityAt = new Date();
  await room.save();
  return room;
};

// Builds the payload sent to clients on every roomUpdate broadcast
export const serializeRoom = (room) => ({
  room: {
    instanceId: room.instanceId,
    hostId: room.hostId,
    status: room.status,
    capacity: room.capacity,
  },
  players: room.players.map(({ discordId, username, avatar }) => ({
    discordId,
    username,
    avatar,
    isHost: discordId === room.hostId,
  })),
  spectators: room.spectators.map(({ discordId, username, avatar }) => ({
    discordId,
    username,
    avatar,
  })),
});