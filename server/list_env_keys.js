
import dotenv from 'dotenv';
dotenv.config();

console.log("Available environment keys:");
Object.keys(process.env).forEach(key => {
    if (key.includes('CLOUD') || key.includes('KEY') || key.includes('SECRET')) {
        console.log(key);
    }
});
