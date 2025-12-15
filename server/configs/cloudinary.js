// configs/cloudinary.js
import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = async () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env["CLOUDINARY-CLOUD-NAME"],
    api_key: process.env.CLOUDINARY_API_KEY || process.env["CLOUDINARY-API-KEY"],
    api_secret: process.env.CLOUDINARY_API_SECRET || process.env["CLOUDINARY-API-SECRET"],
  });
};

export default connectCloudinary;