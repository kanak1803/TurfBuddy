import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Game from "../models/Game";
import mongoose from "mongoose";

export const createGame = async (req: AuthRequest, res: Response) => {
  try {
    const { sport, location, date, time, playerNeeded } = req.body;
    // ✅ Input validation inside the controller
    if (!sport) {
      res.status(400).json({ message: "Sport is required" });
      return;
    }
    if (!location || !location.address || !location.city) {
      res
        .status(400)
        .json({ message: "Valid location (address & city) is required" });
      return;
    }
    if (!date || isNaN(new Date(date).getTime())) {
      res.status(400).json({ message: "Valid date is required" });
      return;
    }
    if (!time) {
      res.status(400).json({ message: "Time is required" });
      return;
    }
    if (!playerNeeded || typeof playerNeeded !== "number" || playerNeeded < 1) {
      res.status(400).json({ message: "Players needed must be at least 1" });
      return;
    }

    const newGame = new Game({
      sport,
      location,
      date,
      time,
      playerNeeded,
      playerJoined: [],
      host: req.user._id,
      hostContact: req.user.contactNumber,
    });
    await newGame.save();
    res
      .status(201)
      .json({ message: "New game added successfully", game: newGame });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create game" });
  }
};

export const getAllGames = async (req: Request, res: Response) => {
  try {
    const { sport, date, city } = req.query;
    let filter: any = {};
    if (city)
      filter["location.city"] = { $regex: new RegExp(city as string, "i") };
    if (sport) filter.sport = { $regex: new RegExp(sport as string, "i") };
    if (date) filter.date = new Date(date as string);
    const games = await Game.find(filter)
      .populate({
        path: "host",
        select: "name email contactNumber",
        model: "User",
      })
      .populate({ path: "playerJoined", select: "name email", model: "User" });
    res.status(200).json({ success: true, games });
  } catch (error) {
    console.log("Server error", error);
    res.status(500).json({ message: "failed to fetch games from DB" });
  }
};

export const getSingleGame = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    //validate mongodb objectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid Game ID" });
      return;
    }

    //fetch the game from DB
    const game = await Game.findById(id)
      .populate({
        path: "host",
        select: "name email contactNumber",
        model: "User",
      })
      .populate({ path: "playerJoined", select: "name email", model: "User" });
    //check if game if found or not
    console.log(game?.host);
    if (!game) {
      res.status(404).json({ message: "Game not found" });
      return;
    }
    res.status(200).json(game);
  } catch (error) {
    console.error("Error fetching game:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const joinGame = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid game ID cannot join" });
      return;
    }
    //find the game
    const game = await Game.findById(id);
    if (!game) {
      res.status(404).json({ message: "Game not found" });
      return;
    }

    //not able to join host his own game

    if (game.host.toString() === userId.toString()) {
      res.status(400).json({ message: "You cannnot join your own game" });
      return;
    }

    if (game.playerJoined.includes(userId)) {
      res.status(400).json({ message: "You have already joined this Game" });
      return;
    }

    //check if game is alread full
    if (game.playerJoined.length >= game.playerNeeded) {
      res.status(400).json({ message: "Game is full,no player can join now" });
      return;
    }

    game.playerJoined.push(userId);
    if (game.playerJoined.length >= game.playerNeeded) {
      game.status = "full";
    }
    await game.save();
    const updatedGame = await Game.findById(id)
      .populate({
        path: "host",
        select: "name email contactNumber",
        model: "User",
      })
      .populate({
        path: "playerJoined",
        select: "name email contactNumber",
        model: "User",
      });
    res.status(200).json(updatedGame);
  } catch (error) {
    console.error("Error joining game:", error);
    res.status(500).json({ message: "Server error" });
  }
};
