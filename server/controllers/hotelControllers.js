import User from "../models/User.js";
import Hotel from "../models/Hotel.js";

export const registerHotel = async (req, res) => {
    try {
        console.log("Registering hotel with body:", req.body);
        const { name, address, contact, city } = req.body;
        const owner = req.auth.userId; // Ensure we use proper auth property, protect middleware sets req.auth or we check req.user._id if middleware sets that. 
        // actually looking at authMiddleware, it sets req.user = user. 
        // But let's check what protect middleware does in `authMiddleware.js`.
        // It says: const { userId } = req.auth; -> req.user = user;
        // So req.user._id is safer if protect is used.
        // The original code used `req.user._id` which is correct IF `protect` is used.
        // Let's stick to `req.user._id` but add logging.

        // Wait, I should double check authMiddleware.
        // authMiddleware: 
        // export const protect = async (req, res, next) => {
        //     const { userId } = req.auth; ... req.user = user; ... }
        // So req.user is populated.

        console.log("Owner ID:", req.user._id);

        // Check if User Already Registered a Hotel
        const hotel = await Hotel.findOne({ owner: req.user._id });
        if (hotel) {
            console.log("Hotel already registered for this user");
            return res.json({
                success: false,
                message: "Hotel Already Registered"
            });
        }

        await Hotel.create({ name, address, contact, city, owner: req.user._id });

        await User.findByIdAndUpdate(req.user._id, { role: "hotelOwner" });
        console.log("Hotel registered successfully");

        res.json({
            success: true,
            message: "Hotel Registered Successfully"
        });

    } catch (error) {
        console.error("Register hotel error:", error);
        res.json({
            success: false,
            message: error.message
        });
    }
};
