import { Server } from "socket.io";
import { registerRoomHandlers } from "./roomHandlers.js";
import { registerPatternGameHandlers } from "./patternGameHandlers.js";

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "*",
      credentials: true,
    },
  });

  // Runs once per connection attempt, before "connection" fires.
  // Rejects sockets that don't carry the expected Discord identity fields.
  io.use((socket, next) => {
    const { instanceId, discordId, username } = socket.handshake.auth || {};

    if (!instanceId || !discordId || !username) {
      return next(new Error("Missing auth: instanceId, discordId, and username are required"));
    }

    // Attach validated identity to the socket for handlers to use downstream
    socket.data.instanceId = instanceId;
    socket.data.discordId = discordId;
    socket.data.username = username;
    socket.data.avatar = socket.handshake.auth.avatar || null;

    next();
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id} (${socket.data.username})`);

    // Join a Socket.io "room" matching the Discord instanceId, so io.to(instanceId)
    // broadcasts reach only this voice channel's participants
    socket.join(socket.data.instanceId);

    registerRoomHandlers(io, socket);
    registerPatternGameHandlers(io, socket);

    socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected: ${socket.id} (${reason})`);
      // Actual room-membership cleanup happens inside registerRoomHandlers,
      // which attaches its own disconnect listener with grace-period logic
    });
  });

  return io;
};