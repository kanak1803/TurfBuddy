import express from "express";
import {
  createGame,
  deleteGame,
  getAllGames,
  getSingleGame,
  joinGame,
  leaveGame,
} from "../controllers/gameController";
import { protectRoute } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/creategame", protectRoute, createGame);
router.get("/", getAllGames);
router.get("/:id", getSingleGame);
router.post("/joingame/:id", protectRoute, joinGame);
router.post("/deletegame/:id", protectRoute, deleteGame);
router.post("/leavegame/:id", protectRoute, leaveGame);

export default router;
