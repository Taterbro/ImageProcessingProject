import { Response, Request } from "express";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";
import { Image } from "../models/image";
import { authRequest } from "../utils/authToken";

export const uploadImage = async (req: authRequest, res: Response) => {
  try {
    if (req.file) {
      const imageLink = await uploadToCloudinary(req.file?.path);
      const image = new Image({
        url: imageLink.url,
        uploadedBy: req.user?.userId,
      });
      await image.save();
      res.json({ message: "File uploaded!", url: imageLink.url });
      return;
    }
  } catch (err: any) {
    res.status(500).send("something went wrong");
    console.log(err.message);
    return;
  }
};
