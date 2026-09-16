import { io } from "socket.io-client";

// Discord ke andar direct backend URL blocked hota hai — hamesha
// current origin (jo Discord ka proxy domain hai) ke through jaana hai
const SOCKET_URL = window.location.origin;

// autoConnect: false — we connect manually once we have the Discord user + instanceId ready
export const socket = io(SOCKET_URL, {
  path: "/.proxy/socketio", // 👈 yeh naya hai — /.proxy/ prefix zaroori hai Discord proxy ke liye
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket", "polling"], // polling fallback rakha, agar websocket fail ho to bhi try kare
});

// Call this once, after Discord auth + instanceId are available
export const connectSocket = ({ instanceId, discordUser }) => {
  if (socket.connected) return;

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