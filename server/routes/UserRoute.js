import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getUserData, storeRecentSearchedCities, toggleWishlist } from "../controllers/userControllers.js";
const userRouter = express.Router()
userRouter.get('/', protect, getUserData)
userRouter.post('/recent-city', protect, storeRecentSearchedCities)
userRouter.post('/toggle-wishlist', protect, toggleWishlist)

export default userRouter