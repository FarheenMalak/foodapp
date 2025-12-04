// config/cloudinaryConfig.js
import { v2 as cloudinary } from "cloudinary";
import 'dotenv/config';

const config = {
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
};

// Validate
if (!config.cloud_name || !config.api_key || !config.api_secret) {
  console.error("Please check your .env file in:", process.cwd());
} else {
  cloudinary.config(config);
}

export default cloudinary;