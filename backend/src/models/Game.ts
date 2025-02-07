import mongoose from "mongoose";

export interface IGame {
  sport: string;
  location: {
    address: string;
    city: string;
  };
  date: Date;
  time: string;
  playerNeeded: number;
  host: mongoose.Schema.Types.ObjectId;
  hostContact: string;
  playerJoined: mongoose.Schema.Types.ObjectId;
  status: "open" | "full" | "played";
}

const gameSchema = new mongoose.Schema<IGame>(
  {
    sport: { type: String, required: true },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
    },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    playerNeeded: { type: Number, required: true },
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    hostContact: { type: String, required: true },
    playerJoined: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: { type: String, enum: ["open", "full", "played"], default: "open" },
  },
  { timestamps: true }
);

const Game = mongoose.model<IGame>("Game", gameSchema);
export default Game;
