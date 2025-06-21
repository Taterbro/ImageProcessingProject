import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

interface authRequest extends Request {
  user: any;
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
    if (token == null) {
      res.status(401).json({ message: "Access Denied: No token provided." });
    }

    const decoded =
      token &&
      (jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          console.error("JWT Verification Error:", err);
          // Handle specific JWT errors if needed (e.g., TokenExpiredError, JsonWebTokenError)
          if (err instanceof jwt.TokenExpiredError) {
            res.status(401).json({ message: "Access Denied: Token expired." });
          }
          res.status(403).json({ message: "Access Denied: Invalid token." });
        }
      }) as any);
    const user = await User.findById(decoded.userId);
    if (!user || user.userToken !== token) {
      res.status(401).json({ message: "Token expired" });
    }
    req.user = decoded;
    next();
  } catch (err: any) {
    res.status(401).json({ message: "Invalid token" });
    console.log(err.message);
    return;
  }
};
