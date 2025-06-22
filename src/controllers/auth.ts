import { Request, Response } from "express";
import { User } from "../models/user";
import missingFields from "../utils/missingFields";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  if (missingFields(req, res, ["username", "password"])) {
    return;
  }
  try {
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      res
        .status(401)
        .json({ message: "Account already exists; Please login instead." });
      return;
    }
    const hashed = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      password: hashed,
    });
    user.save().then((user) => {
      res.status(201).json({ message: "Registered Successfully", user: user });
      return;
    });
  } catch (err) {
    res.status(500).json({ message: "something went wrong" });
    console.log(err);
  }
};

export const login = async (req: Request, res: Response) => {
  if (missingFields(req, res, ["username", "password"])) {
    return;
  }
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      res
        .status(404)
        .json({ message: "User doesn't exist, please create an account" });
    } else if (user && process.env.JWT_SECRET) {
      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        user?.password
      );
      if (isPasswordValid === false) {
        res.json({ message: "Incorrect password" });
        return;
      }
      const token = jwt.sign(
        { user: req.body.username, userId: user._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "5 days",
        }
      );
      await User.findByIdAndUpdate(user._id, { userToken: token });
      res.status(200).json({ message: "Logged in successfully", token: token });
      return;
    }
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ message: "something went wrong" });
    return;
  }
};
