import { Request, Response } from "express";
import { User } from "../models/user";
import missingFields from "../utils/missingFields";
import bcrypt from "bcryptjs";

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
