import mongoose from "mongoose";

const editedSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

export const Edited = mongoose.model("edit", editedSchema);
