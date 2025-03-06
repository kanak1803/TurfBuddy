import express from "express";
import {
  createGame,
  deleteGame,
  getAllGames,
  getSingleGame,
  joinGame,
  leaveGame,
  updateGame,
} from "../controllers/gameController";
import { protectRoute } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/creategame", protectRoute, createGame);
router.get("/", getAllGames);
router.get("/:id", getSingleGame);
router.post("/joingame/:id", protectRoute, joinGame);
router.delete("/deletegame/:id", protectRoute, deleteGame);
router.post("/leavegame/:id", protectRoute, leaveGame);
router.post("/updategame/:id", protectRoute, updateGame);

export default router;
