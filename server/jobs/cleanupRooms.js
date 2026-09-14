import Room from "../models/Room.js";

const IDLE_ROOM_MAX_AGE_MS = 10 * 60 * 1000; // 10 minutes of no activity
const SWEEP_INTERVAL_MS = 2 * 60 * 1000;      // run every 2 minutes

export const startCleanupJob = (io) => {
  setInterval(async () => {
    const cutoff = new Date(Date.now() - IDLE_ROOM_MAX_AGE_MS);

    try {
      // Case 1: explicitly idle rooms (everyone left, or opted out with no restart)
      // that have sat untouched past the cutoff
      const idleRooms = await Room.find({
        status: "idle",
        lastActivityAt: { $lt: cutoff },
      });

      // Case 2: rooms stuck in "lobby" with zero players AND zero spectators —
      // can happen if the very last member's disconnect grace-period cleanup
      // ran but the status flip didn't (defensive, shouldn't normally occur)
      const emptyLobbies = await Room.find({
        status: "lobby",
        players: { $size: 0 },
        spectators: { $size: 0 },
        lastActivityAt: { $lt: cutoff },
      });

      const toDelete = [...idleRooms, ...emptyLobbies];

      for (const room of toDelete) {
        // Let anyone still somehow connected know the room is gone before we delete it
        io.to(room.instanceId).emit("roomClosed", {
          reason: "Room closed due to inactivity",
        });

        await Room.deleteOne({ _id: room._id });
        console.log(`Cleaned up idle room: ${room.instanceId}`);
      }

      if (toDelete.length > 0) {
        console.log(`Cleanup sweep: removed ${toDelete.length} room(s)`);
      }
    } catch (error) {
      console.error("Cleanup sweep error:", error);
    }
  }, SWEEP_INTERVAL_MS);
};