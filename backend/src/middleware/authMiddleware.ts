import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: any;
}

export const protectRoute = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    //extracted token from cookies
    const token = req.cookies.jwt;
    //check if token is there
    if (!token) {
      res.status(401).json({ message: "Not authorized,no token found" });
      return;
    }

    // verfiy token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    //check if token is valid
    if (!decoded) {
      res.status(401).json({ message: "Unauthorized - Invalid token" });
      return;
    }
    req.user = decoded;
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(401).json({ message: "Not authorized, invalid token" });
  }
};
