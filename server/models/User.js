import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    discordId: {
      type: String,
      required: true,
      unique: true,
    },

    username: {
      type: String,
      required: true,
    },

    globalName: {
      type: String,
      default: "",
    },

    avatar: {
      type: String,
      default: "",
    },
    points: {
    type: Number,
    default: 0,
  },

    gamesPlayed: {
      type: Number,
      default: 0,
    },

    gamesWon: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;