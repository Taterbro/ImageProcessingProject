import { NextFunction, Response, Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user";

export interface authRequest extends Request {
  user?: JwtPayload;
}

export const authenticateToken = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  if (!process.env.JWT_SECRET) {
    console.error(
      "FATAL ERROR: JWT_SECRET is not defined in environment variables."
    );
    process.exit(0); // Exit the process if the secret is missing
  }

  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token === null) {
      res.status(401).json({ message: "Access Denied: No token provided." });
      return;
    }

    const decoded = token && (jwt.verify(token, process.env.JWT_SECRET) as any);
    const user = await User.findById(decoded.userId);
    if (!user || user.userToken !== token) {
      res.status(401).json({ message: "Token expired" });
      return;
    }
    req.user = decoded;
    next();
  } catch (err: any) {
    res.status(401).json({ message: "Invalid token" });
    console.log(err.message);
    return;
  }
};
