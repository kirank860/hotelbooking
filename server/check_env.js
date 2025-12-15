
import dotenv from 'dotenv';
dotenv.config();

console.log("Checking .env keys...");
if (process.env.CLERK_PUBLISHABLE_KEY) console.log("CLERK_PUBLISHABLE_KEY found");
else console.log("CLERK_PUBLISHABLE_KEY MISSING");

if (process.env.CLERK_SECRET_KEY) console.log("CLERK_SECRET_KEY found");
else console.log("CLERK_SECRET_KEY MISSING");
