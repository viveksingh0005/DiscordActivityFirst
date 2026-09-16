import { Server } from "socket.io";
import { registerRoomHandlers } from "./roomHandlers.js";


export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    path: "/socketio",
     transports: ["polling"],  
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

    socket.data.instanceId = instanceId;
    socket.data.discordId = discordId;
    socket.data.username = username;
    socket.data.avatar = socket.handshake.auth.avatar || null;

    next();
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id} (${socket.data.username})`);

    socket.join(socket.data.instanceId);

    registerRoomHandlers(io, socket);
   

    socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected: ${socket.id} (${reason})`);
    });
  });

  return io;
};