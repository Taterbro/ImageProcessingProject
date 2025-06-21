import express from "express";
import { uploadImage } from "../controllers/images";
import multer from "multer";

const images = express.Router();

const upload = multer({
  //setup to allow saving files
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
});

images.post("/", upload.single("photo"), uploadImage);

export default images;
