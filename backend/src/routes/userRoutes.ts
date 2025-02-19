import express from "express";
import {
  checkAuth,
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/userController";
import { protectRoute } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protectRoute, getUserProfile);
router.post("/logout", logoutUser);
router.get("/check", protectRoute, checkAuth);

export default router;
