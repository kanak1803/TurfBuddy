import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export interface AuthRequest extends Request {
  user?: any;
}

export const protectRoute = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log("Cookies received:", req.cookies); 
    //extracted token from cookies
    const token = req.cookies.jwt;
    //check if token is there
    if (!token) {
      res.status(401).json({ message: "Not authorized,no token found" });
      return;
    }

    // verfiy token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    //check if token is valid
    if (!decoded) {
      res.status(401).json({ message: "Unauthorized - Invalid token" });
      return;
    }
    const user = await User.findById(decoded.userId).select("-password");
    console.log("userinmid",user)
    if (!user) {
      res.status(401).json({ message: "Not authorized, user not found" });
      return;
    }
    req.user = user;
    next();
   
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(401).json({ message: "Not authorized, invalid token" });
  }
};
