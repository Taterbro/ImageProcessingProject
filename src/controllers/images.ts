import { Response, Request } from "express";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (req.file) {
      const imageLink = await uploadToCloudinary(req.file?.path);
      res.json({ message: "File uploaded!", url: imageLink.url });
      return;
    }
  } catch (err: any) {
    res.status(500).send("something went wrong");
    console.log(err.message);
    return;
  }
};
