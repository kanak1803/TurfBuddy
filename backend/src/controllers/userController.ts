import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, password, contactNumber, preferredSports } = req.body;
  try {
    //checking if user filled all required fields
    if (!name || !email || !password || !contactNumber) {
      res.status(400).json({ message: "Filled all required fields" });
      return;
    }

    //checking if password length is greater than 8

    if (password.length < 8) {
      res
        .status(400)
        .json({ message: "Password should be atleast of 8 Characters" });
      return;
    }

    if (!/^\d{10}$/.test(contactNumber)) {
      res.status(400).json({ message: "Contact number is invalid" });
      return;
    }

    //check if user already exists in database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exist" });
      return;
    }

    //hashing password
    const hashedPassword = await bcrypt.hash(password, 10);
    //creating new user in DB
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      contactNumber,
      preferredSports,
    });

    await newUser.save();
    //creating JWT token
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "30d" }
    );
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
      token,
    });
  } catch (error) {
    console.log(error, "failed to register User");
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  //check if user exist in db

  try {
    const userExist = await User.findOne({ email });

    if (!userExist) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    //comparing password with hashedDB password
    const isPasswordValid = await bcrypt.compare(password, userExist.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid password" });
      return;
    }
    //generate jwt token
    const token = jwt.sign(
      { userId: userExist._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "30d" }
    );

    res.status(200).json({
      message: "Login successfully",
      user: {
        id: userExist._id,
        name: userExist.name,
        email: userExist.email,
        contactNumber: userExist.contactNumber,
        preferredSports: userExist.preferredSports,
      },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
