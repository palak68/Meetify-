import express from "express";
import { register, login, getUserHistory, addToHistory } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/history", authMiddleware, getUserHistory);
router.post("/history", authMiddleware, addToHistory);

export default router;