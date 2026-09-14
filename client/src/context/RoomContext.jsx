import { createContext, useContext, useEffect, useState } from "react";
import { socket } from "../socket/socket";

const RoomContext = createContext(null);

export const RoomProvider = ({ children }) => {
  const [room, setRoom] = useState(null);       // { instanceId, hostId, status, capacity }
  const [players, setPlayers] = useState([]);   // [{ discordId, username, avatar }]
  const [spectators, setSpectators] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [session, setSession] = useState(null); // current pattern-round session state

  useEffect(() => {
    // Server sends this once on join, and again any time room membership changes
    const onRoomUpdate = (data) => {
      setRoom(data.room);
      setPlayers(data.players);
      setSpectators(data.spectators);
      setIsHost(data.hostId === socket.auth?.discordId);
    };

    const onSessionUpdate = (data) => {
      setSession(data);
    };

    const onDisconnect = () => {
      // Don't wipe state immediately — server has a grace period,
      // UI can show a "reconnecting..." state instead of resetting everything
      console.warn("Socket disconnected, attempting reconnect...");
    };

    socket.on("roomUpdate", onRoomUpdate);
    socket.on("sessionUpdate", onSessionUpdate);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("roomUpdate", onRoomUpdate);
      socket.off("sessionUpdate", onSessionUpdate);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  const value = { room, players, spectators, isHost, session };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};

export const useRoom = () => useContext(RoomContext);