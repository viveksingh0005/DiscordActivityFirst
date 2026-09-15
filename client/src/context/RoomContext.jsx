import { createContext, useContext, useEffect, useState } from "react";
import { socket, connectSocket, disconnectSocket } from "../socket/socket";
import { useDiscordSdk } from "../hooks/useDiscordSdk"; // 👈 apne actual hook/context ka import path yahan lagao

const RoomContext = createContext(null);

export const RoomProvider = ({ children }) => {
  // 👈 yahan se instanceId aur discordUser milna chahiye — apne hook ke hisaab se badlo
  const { instanceId, discordUser } = useDiscordSdk();

  const [room, setRoom] = useState(null);
  const [players, setPlayers] = useState([]);
  const [spectators, setSpectators] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Jab tak Discord se instanceId aur discordUser nahi milte, connect mat karo
    if (!instanceId || !discordUser) {
      console.log("[RoomProvider] waiting for Discord data:", { instanceId, discordUser });
      return;
    }

    console.log("[RoomProvider] connecting with:", { instanceId, discordUser });
    connectSocket({ instanceId, discordUser });

    const onConnect = () => {
      console.log("[socket] connected:", socket.id);
    };

    const onConnectError = (err) => {
      console.log("[socket] connect_error:", err.message);
    };

    const onRoomUpdate = (data) => {
      console.log("[socket] roomUpdate received:", data);
      setRoom(data.room);
      setPlayers(data.players);
      setSpectators(data.spectators);
      setIsHost(data.hostId === socket.auth?.discordId);
    };

    const onSessionUpdate = (data) => {
      console.log("[socket] sessionUpdate received:", data);
      setSession(data);
    };

    const onDisconnect = (reason) => {
      console.warn("[socket] disconnected:", reason);
    };

    socket.on("connect", onConnect);
    socket.on("connect_error", onConnectError);
    socket.on("roomUpdate", onRoomUpdate);
    socket.on("sessionUpdate", onSessionUpdate);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("connect_error", onConnectError);
      socket.off("roomUpdate", onRoomUpdate);
      socket.off("sessionUpdate", onSessionUpdate);
      socket.off("disconnect", onDisconnect);
      disconnectSocket();
    };
  }, [instanceId, discordUser]);

  const value = { room, players, spectators, isHost, session };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};

export const useRoom = () => useContext(RoomContext);