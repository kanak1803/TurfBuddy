import express from "express";
import {
  createGame,
  deleteGame,
  getAllGames,
  getSingleGame,
  joinGame,
} from "../controllers/gameController";
import { protectRoute } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/creategame", protectRoute, createGame);
router.get("/", getAllGames);
router.get("/:id", getSingleGame);
router.post("/joingame/:id", protectRoute, joinGame);
router.post("/deletegame/:id", protectRoute, deleteGame);

export default router;
