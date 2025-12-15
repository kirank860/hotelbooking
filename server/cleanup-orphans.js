import mongoose from "mongoose";
import dotenv from "dotenv";
import Hotel from "./models/Hotel.js";
import Room from "./models/Room.js";

dotenv.config();

const cleanupOrphanedRooms = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        // Get all rooms
        const allRooms = await Room.find({});
        console.log(`Found ${allRooms.length} total rooms`);

        let deletedCount = 0;

        for (const room of allRooms) {
            // Check if the hotel exists
            const hotelExists = await Hotel.findById(room.hotel);

            if (!hotelExists) {
                console.log(`Deleting orphaned room ${room._id} (hotel ${room.hotel} not found)`);
                await Room.findByIdAndDelete(room._id);
                deletedCount++;
            }
        }

        console.log(`✅ Cleanup complete! Deleted ${deletedCount} orphaned rooms.`);
        process.exit(0);

    } catch (error) {
        console.error("Cleanup Error:", error);
        process.exit(1);
    }
};

cleanupOrphanedRooms();
