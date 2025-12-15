import User from "../models/User.js";

// Middleware to check if user is authenticated
import { clerkClient } from "@clerk/express";

// Middleware to check if user is authenticated
export const protect = async (req, res, next) => {
    try {
        console.log("Auth Middleware - Headers Auth:", req.headers.authorization ? "Present" : "Missing");
        console.log("Auth Middleware - req.auth:", req.auth);

        if (!req.auth) {
            console.log("req.auth is undefined. Clerk middleware check failed.");
            return res.json({ success: false, message: "Internal Auth Error - req.auth missing" });
        }
        const { userId } = req.auth;

        if (!userId) {
            console.log("Auth Middleware - No userId in req.auth");
            return res.json({
                success: false,
                message: "not authenticated. Debug: " + JSON.stringify(req.auth)
            });
        }

        let user = await User.findById(userId);

        if (!user) {
            console.log("User not found in DB, attempting JIT sync from Clerk:", userId);
            try {
                const clerkUser = await clerkClient.users.getUser(userId);

                const userData = {
                    _id: userId,
                    email: clerkUser.emailAddresses[0].emailAddress,
                    username: (clerkUser.firstName || "") + " " + (clerkUser.lastName || ""),
                    image: clerkUser.imageUrl,
                    recentSearchedCities: [],
                    role: "user"
                };

                user = await User.create(userData);
                console.log("JIT sync successful for user:", userId);
            } catch (clerkError) {
                console.error("Failed to fetch/data-sync user from Clerk:", clerkError);
                // Fallback or just continue? If we can't create, we return error.
                return res.json({
                    success: false,
                    message: "User synchronization failed. Please contact support."
                });
            }
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        res.json({ success: false, message: error.message });
    }
};
