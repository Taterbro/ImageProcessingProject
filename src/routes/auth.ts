import express from "express";
import { register } from "../controllers/auth";

const auth = express.Router();

auth.post("/register", register);

export default auth;
