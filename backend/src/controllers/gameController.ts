import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Game from "../models/Game";
import mongoose from "mongoose";
import User from "../models/User";

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
    //updated gamehosted in the user model
    await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { gameHosted: newGame._id } },
      { new: true }
    );
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

    //update gameJoined in the user modal
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { gameJoined: id } },
      { new: true }
    );
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

export const deleteGame = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid game ID" });
      return;
    }

    //find the game
    const game = await Game.findById(id);
    if (!game) {
      res.status(404).json({ message: "Game not found" });
      return;
    }

    //check if user logged in is the host of the game
    if (game.host.toString() !== userId.toString()) {
      res
        .status(403)
        .json({ message: "You dont have authorization to delete this game" });
      return;
    }

    //delete the game
    await Game.findByIdAndDelete(id);
    res.status(200).json({ message: "Game deleted successfully" });
  } catch (error) {
    console.error("Error deleting game:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const leaveGame = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    //find the game
    const game = await Game.findById(id);
    if (!game) {
      res.status(404).json({ message: "Game not found" });
      return;
    }

    //prevent host from leaving the game
    if (game.host.toString() === userId.toString()) {
      res.status(400).json({ message: "Host cannot leave their own game" });
      return;
    }

    //check if user is in has join the game
    const playerIndex = game.playerJoined.findIndex(
      (player) => player.toString() === userId.toString()
    );
    if (playerIndex === -1) {
      res.status(400).json({ message: "You are not part of this game" });
      return;
    }

    //remove player from the list
    game.playerJoined.splice(playerIndex, 1);

    if (
      game.status === "full" &&
      game.playerJoined.length < game.playerNeeded
    ) {
      game.status = "open";
    }
    await game.save();

    res.status(200).json({ message: "You have left the game", game });
  } catch (error) {
    console.error("Error leaving game:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateGame = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const updateFields = req.body;

    //find the game
    const game = await Game.findById(id);
    if (!game) {
      res.status(404).json({ message: "Game not found" });
      return;
    }

    //allow only host to update the game details
    if (game.host.toString() !== userId.toString()) {
      res
        .status(400)
        .json({ message: "Your are not authorized to update game details" });
      return;
    }

    //prevent updating restricted Fields
    const restrictedFields = ["host", "playerJoined", "status"];
    restrictedFields.forEach((field) => delete updateFields[field]);

    Object.assign(game, updateFields);
    await game.save();
    res.status(200).json({ message: "Game updated successfully", game });
  } catch (error) {
    console.error("Error updating game:", error);
    res.status(500).json({ message: "Server error" });
  }
};
