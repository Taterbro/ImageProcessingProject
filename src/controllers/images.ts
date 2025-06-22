import { Response, Request } from "express";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";
import cloudinary from "../utils/cloudinaryUpload";
import { Image } from "../models/image";
import { authRequest } from "../utils/authToken";

export const uploadImage = async (req: authRequest, res: Response) => {
  try {
    if (req.file) {
      const imageLink = await uploadToCloudinary(req.file?.path);
      const image = new Image({
        url: imageLink.url,
        uploadedBy: req.user?.userId,
        publicId: imageLink.public_id,
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

export const transformImage = async (req: authRequest, res: Response) => {
  const id = req.params.id;
  if (!req.body.transformations) {
    res.status(400).json({ message: "No transformations found." });
    return;
  }
  try {
    const image = await Image.findById(id);
    if (image?.uploadedBy.toString() !== req.user?.userId) {
      res
        .status(401)
        .json({ message: "You do not have permission to edit this image" });
      return;
    }
    const publicId = image?.publicId;
    const edited =
      publicId &&
      cloudinary.url(publicId, { transformation: req.body.transformations });
    res.json({
      message: "Photo edited",
      photo: edited,
      transformations: req.body.transformations,
    });
    return;
  } catch (err: any) {
    res.status(500).send({ message: "something went wrong" });
    console.log(err.message);
    return;
  }
};
