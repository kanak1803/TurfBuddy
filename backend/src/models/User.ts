import mongoose from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  contactNumber: string;
  preferredSports: string[];
  profileImage: string;
  gameJoined: mongoose.Schema.Types.ObjectId[];
  gameHosted: mongoose.Schema.Types.ObjectId[];
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contactNumber: { type: String, required: true },
    preferredSports: { type: [String], default: [] },
    profileImage: { type: String, default: "" },
    gameJoined: [{ type: mongoose.Schema.Types.ObjectId, ref: "Game" }],
    gameHosted: [{ type: mongoose.Schema.Types.ObjectId, ref: "Game" }],
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
