import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/userController";
import { protectRoute } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile");
router.post("/logout", logoutUser);

export default router;
