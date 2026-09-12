import express from "express";
import { getProfile, getLeaderboard } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);
router.get("/leaderboard", authMiddleware, getLeaderboard);

export default router;