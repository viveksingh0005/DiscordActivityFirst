import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import gameRoutes from "./routes/gameRoutes.js"
dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "https://client-ux1k.vercel.app",
        /\.discordsays\.com$/, // Discord ke saare sandboxed domains
      ];

      // agar origin undefined hai (jaise server-to-server call), allow kar dein
      if (!origin) return callback(null, true);

      const isAllowed = allowedOrigins.some((allowed) =>
        typeof allowed === "string"
          ? allowed === origin
          : allowed.test(origin)
      );

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/game", gameRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Alpha Memory API is running",
  });
});

// Connect database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});