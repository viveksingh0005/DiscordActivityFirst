import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    discordId: { type: String, required: true },
    username: { type: String, required: true },
    avatar: { type: String }, // Discord avatar hash, can be null
    socketId: { type: String, required: true },
    connected: { type: Boolean, default: true },
    disconnectedAt: { type: Date, default: null }, // for grace-period reconnect logic
  },
  { _id: false }
);

const roomSchema = new mongoose.Schema(
  {
    instanceId: { type: String, required: true, unique: true, index: true },
    hostId: { type: String, required: true }, // discordId of current host

    players: { type: [memberSchema], default: [] },
    spectators: { type: [memberSchema], default: [] },
    capacity: { type: Number, default: 4 },

    status: {
      type: String,
      enum: ["lobby", "active", "idle"],
      default: "lobby",
    },

    currentSessionId: { type: mongoose.Schema.Types.ObjectId, ref: "PatternSession", default: null },

    lastActivityAt: { type: Date, default: Date.now }, // for the inactivity cleanup sweep
  },
  { timestamps: true }
);


roomSchema.index({ lastActivityAt: 1 });

export default mongoose.model("Room", roomSchema);