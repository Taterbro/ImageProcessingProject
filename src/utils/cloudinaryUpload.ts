import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const uploadToCloudinary = async (
  filePath: string,
  options: any = {}
) => {
  const defaultOptions = {
    folder: "ImageProcessorFolder",
    resource_type: "image",
    transformation: [
      { width: 800, height: 600, crop: "limit" },
      { quality: "auto" },
    ],
    ...options,
  };

  try {
    const result = await cloudinary.uploader.upload(filePath, defaultOptions);

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        return;
      }
      console.log("File deleted successfully");
    });

    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Delete function (useful for updating/deleting blogs)
export const deleteFromCloudinary = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: true,
      result,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export default cloudinary;
