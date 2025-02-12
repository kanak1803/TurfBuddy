import express from "express";
import {
  createGame,
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

export default router;
