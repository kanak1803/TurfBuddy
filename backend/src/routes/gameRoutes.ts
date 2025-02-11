import express from "express";
import { createGame, getAllGames, getSingleGame } from "../controllers/gameController";
import { protectRoute } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/creategame", protectRoute, createGame);
router.get("/", getAllGames);
router.get("/:id", getSingleGame);

export default router;
