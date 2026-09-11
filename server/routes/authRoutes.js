import express from "express";
import { discordLogin } from "../controllers/authController.js";

const router = express.Router();

router.post("/discord", discordLogin);

export default router;