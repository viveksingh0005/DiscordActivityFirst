import express from "express";

import { winGame ,startGame, submitAnswer} from "../controllers/gameController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/start",authMiddleware, startGame);

router.post("/answer",authMiddleware,submitAnswer
);
router.post("/win", authMiddleware, winGame);

export default router;