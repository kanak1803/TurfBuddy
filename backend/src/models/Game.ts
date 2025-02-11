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
  playerJoined: mongoose.Schema.Types.ObjectId[];
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
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    hostContact: { type: String, required: true },
    playerJoined: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: { type: String, enum: ["open", "full", "played"], default: "open" },
  },
  { timestamps: true }
);

//auto process to update game status
gameSchema.pre("save", function (next) {
  const now = new Date();

  // If the game has already been played, mark it as "played"
  if (this.date < now) {
    this.status = "played";
  }
  // If all players joined, set status to "full"
  else if (this.playerJoined.length >= this.playerNeeded) {
    this.status = "full";
  }
  // Otherwise, keep it "open"
  else {
    this.status = "open";
  }

  next();
});

const Game = mongoose.model<IGame>("Game", gameSchema);
export default Game;
