import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";

dotenv.config();
connectDB();

const app: Application = express();

//middleware
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Turfbuddy is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("app is running on:", PORT));
