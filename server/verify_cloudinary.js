
import dotenv from 'dotenv';
dotenv.config();

const cloud_name = process.env.CLOUDINARY_CLOUD_NAME || process.env["CLOUDINARY-CLOUD-NAME"];
const api_key = process.env.CLOUDINARY_API_KEY || process.env["CLOUDINARY-API-KEY"];
const api_secret = process.env.CLOUDINARY_API_SECRET || process.env["CLOUDINARY-API-SECRET"];

console.log("Resolved Cloudinary Config:");
console.log("cloud_name:", cloud_name ? "Found" : "MISSING");
console.log("api_key:", api_key ? "Found" : "MISSING");
console.log("api_secret:", api_secret ? "Found" : "MISSING");
