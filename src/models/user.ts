import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  userToken: { type: String },
});

export const User = mongoose.model("user", userSchema);
