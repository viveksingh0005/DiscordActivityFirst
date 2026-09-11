import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    numbers: {
      type: [Number],
      required: true,
    },

    targetSum: {
      type: Number,
      required: true,
    },

    targetIndexes: {
      type: [Number],
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "won", "lost"],
      default: "active",
    },

    pointsAwarded: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Game = mongoose.model("Game", gameSchema);

export default Game;