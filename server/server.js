import express from "express";
import http from "http"; // 👈 add kiya
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { initSocket } from "./sockets/index.js"; // 👈 apna sahi path daalo

dotenv.config();

const app = express();



// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "https://client-ux1k.vercel.app",
        /\.discordsays\.com$/,
      ];

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
app.use("/auth", authRoutes);
app.use("/game", gameRoutes);
app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Alpha Memory API is running",
  });
});

connectDB();

const PORT = process.env.PORT || 5000;

// 👇 yeh sabse important change hai
const httpServer = http.createServer(app); // Express app ko ek raw http server mein wrap kiya
const io = initSocket(httpServer); // socket.io ko usi server pe attach kiya

httpServer.listen(PORT, () => { // app.listen() ki jagah httpServer.listen()
  console.log(`Server running on port ${PORT}`);
});