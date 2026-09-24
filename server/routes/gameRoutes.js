import express from "express";

import { startGame, submitAnswer, forfeitGame } from "../controllers/gameController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/start",authMiddleware, startGame);

router.post("/answer", authMiddleware, submitAnswer);

router.post("/forfeit", authMiddleware, forfeitGame);


export default router;