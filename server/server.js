import express, { Router } from "express";
import "dotenv/config"
import cors from "cors"
import connectDB from "./configs/db.js";
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/clerkwebhooks.js";
import userRouter from "./routes/UserRoute.js";
import hotelRouter from "./routes/hotelRoute.js";
import connectCloudinary from "./configs/cloudinary.js";
import roomRouter from "./routes/roomRoute.js";
import bookingRouter from "./routes/bookingRoute.js";
connectDB()
connectCloudinary()
const app=express()
app.use(cors())
// middleware
app.use(express.json())
app.use(clerkMiddleware())
app.use("/api/clerk",clerkWebhooks)
app.get("/",(req,res)=>res.send("api is working"))
app.use('/api/user',userRouter)
app.use('/api/hotels',hotelRouter)
app.use('/api/rooms',roomRouter)
app.use('/api/bookings',bookingRouter)
const Port= process.env.Port || 3001

app.listen(Port,()=>console.log(`server running on port ${Port}`))