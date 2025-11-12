import express from "express";
import "dotenv/config"
import cors from "cors"
import connectDB from "./configs/db.js";
import { clerkMiddleware } from '@clerk/express'
connectDB()
const app=express()
app.use(cors())
// middleware
app.use(express.json())
app.use(clerkMiddleware())
app.get("/",(req,res)=>res.send("api is working"))

const Port= process.env.Port || 3001

app.listen(Port,()=>console.log(`server running on port ${Port}`))