import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    discordId: { type: String, required: true },
    selectedIndexes: { type: [Number], default: [] },
    correctCount: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    submittedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const patternSessionSchema = new mongoose.Schema(
  {
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true, index: true },

    roundNumber: { type: Number, required: true },

    // The actual answer — never sent to clients until the round resolves
    pattern: { type: [Number], required: true }, // highlighted box indexes, 0-15

    revealDurationMs: { type: Number, default: 10000 },
    guessDurationMs: { type: Number, default: 10000 },

    phase: {
      type: String,
      enum: ["showing", "guessing", "result"],
      default: "showing",
    },
    phaseEndsAt: { type: Date, required: true },

    submissions: { type: [submissionSchema], default: [] },

    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("PatternSession", patternSessionSchema);