import express from "express";

import { startGame, submitAnswer} from "../controllers/gameController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/start",authMiddleware, startGame);

router.post("/answer",authMiddleware,submitAnswer
);


export default router;