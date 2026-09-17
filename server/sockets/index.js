import { Server } from "socket.io";
import { registerRoomHandlers } from "./roomHandlers.js";
import { registerPatternGameHandlers } from "./patternGameHandlers.js";
const allowedOrigins = [
  "https://client-ux1k.vercel.app",
  /\.discordsays\.com$/,
];

const corsOriginCheck = (origin, callback) => {
  if (!origin) return callback(null, true);

  const isAllowed = allowedOrigins.some((allowed) =>
    typeof allowed === "string" ? allowed === origin : allowed.test(origin)
  );

  if (isAllowed) {
    callback(null, true);
  } else {
    callback(new Error("Not allowed by CORS"));
  }
};

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    path: "/ws",
    transports: ["polling"],
    cors: {
      origin: corsOriginCheck,   // 👈 badla — "*" hataya, function use kiya
      credentials: true,
    },
  });

   io.engine.on("connection_error", (err) => {
    console.log("Engine connection_error:", {
      code: err.code,
      message: err.message,
      context: err.context,
    });
  });

  
  io.engine.on("initial_headers", (headers, req) => {
    console.log("[engine.io] initial_headers for:", req.url, "| origin:", req.headers.origin);
  });

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
    registerPatternGameHandlers(io, socket); 

    socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected: ${socket.id} (${reason})`);
    });
  });

  return io;
};