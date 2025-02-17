import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";
import gameRoutes from "./routes/gameRoutes";
import cookieParser from "cookie-parser";

dotenv.config();
connectDB();

const app: Application = express();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

//middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

console.log("User routes loaded");
app.use("/api/users", userRoutes);
app.use("/api/games", gameRoutes);
app.get("/", (req, res) => {
  res.send("Turfbuddy is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("app is running on:", PORT));
