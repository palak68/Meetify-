import { Router } from "express";
import { login } from "../controllers/user.controller.js";
import { register } from "../controllers/user.controller.js";
const router = Router();
router.route("/login").post(login);
router.route("/register").post(register);
router.route("/get_all_activity");
router.route("/add_to_activity");
export default router;
