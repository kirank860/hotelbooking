
import dotenv from 'dotenv';
dotenv.config();

console.log("Checking Cloudinary keys...");
const keys = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
keys.forEach(key => {
    if (process.env[key]) console.log(`${key} found`);
    else console.log(`${key} MISSING`);
});
