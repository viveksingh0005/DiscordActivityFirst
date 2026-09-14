import { io } from "socket.io-client";

// Use your existing backend URL (same one your REST calls hit)
const SOCKET_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

// autoConnect: false — we connect manually once we have the Discord user + instanceId ready
export const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket"],
});

// Call this once, after Discord auth + instanceId are available
export const connectSocket = ({ instanceId, discordUser }) => {
  if (socket.connected) return;

  // Send identifying info as handshake auth — server reads this on connection
  socket.auth = {
    instanceId,
    discordId: discordUser.id,
    username: discordUser.username,
    avatar: discordUser.avatar,
  };

  socket.connect();
};

export const disconnectSocket = () => {
  if (socket.connected) socket.disconnect();
};