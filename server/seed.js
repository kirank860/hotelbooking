import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Hotel from "./models/Hotel.js";
import Room from "./models/Room.js";

dotenv.config();

const mongoose_url = process.env.MONGODB_URI;

if (!mongoose_url) {
    console.error("MONGODB_URI is missing in .env");
    process.exit(1);
}

const seedData = async () => {
    try {
        await mongoose.connect(mongoose_url);
        console.log("Connected to MongoDB");

        // Clear existing data (Optional: comment out if you want to append)
        await User.deleteMany({ email: { $regex: /@example.com$/ } }); // Only delete seed users
        await Hotel.deleteMany({ description: { $regex: /^Seed Data/ } }); // Only delete seed hotels
        await Room.deleteMany({ description: { $regex: /^Seed Data/ } }); // Only delete seed rooms

        // Actually, safer to just add new ones for now, or carefuly delete.
        // Let's Just ADD data.

        // 1. Create Fake Owners
        const owners = [];
        const cities = ["New York", "London", "Dubai", "Singapore", "Paris", "Tokyo", "Sydney", "Berlin"];

        for (let i = 0; i < 5; i++) {
            const ownerId = `seed_owner_${Date.now()}_${i}`;
            const user = await User.create({
                _id: ownerId,
                username: `HotelOwner ${i + 1}`,
                email: `owner${i + 1}@example.com`,
                image: "https://randomuser.me/api/portraits/men/" + (i + 20) + ".jpg",
                role: "hotelOwner",
                recentSearchedCities: []
            });
            owners.push(user);
        }
        console.log(`Created ${owners.length} owners`);

        // 2. Create Hotels
        const hotelNames = ["Grand Luxury", "Urban Stay", "Cozy Corner", "Skyline Suites", "Ocean View", "Mountain Retreat", "City Center Inn", "Historic Haven", "pikachi tumko"];
        const createdHotels = [];

        for (let i = 0; i < 8; i++) {
            const owner = owners[i % owners.length];
            const city = cities[i % cities.length];

            const hotel = await Hotel.create({
                owner: owner._id,
                name: `${hotelNames[i]} ${city}`,
                email: `contact@${hotelNames[i].replace(/\s/g, '').toLowerCase()}.com`,
                contact: "+1234567890",
                address: `${Math.floor(Math.random() * 100)} Main St, ${city}`,
                city: city,
                description: "Seed Data - A wonderful place to stay.",
                image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80" // Generic hotel image
            });
            createdHotels.push(hotel);
        }
        console.log(`Created ${createdHotels.length} hotels`);

        // 3. Create Rooms
        const roomTypes = ["Single Bed", "Double Bed", "Family Suite", "Luxury Room"];
        const allAmenities = ["Free WiFi", "Free Breakfast", "Room Service", "Mountain View", "Pool Access", "Gym", "Spa"];

        // Images from assets or placeholders
        const roomImages = [
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"
        ];

        for (const hotel of createdHotels) {
            // Create 2-4 rooms per hotel
            const numRooms = Math.floor(Math.random() * 3) + 2;

            for (let j = 0; j < numRooms; j++) {
                const type = roomTypes[Math.floor(Math.random() * roomTypes.length)];
                const price = Math.floor(Math.random() * 400) + 100; // 100 - 500

                // Random amenities (2 to 5)
                const shuffled = allAmenities.sort(() => 0.5 - Math.random());
                const selectedAmenities = shuffled.slice(0, Math.floor(Math.random() * 4) + 2);

                await Room.create({
                    hotel: hotel._id,
                    roomType: type,
                    pricePerNight: price,
                    amenities: selectedAmenities,
                    images: roomImages,
                    isAvailable: true,
                    description: "Seed Data - Experience comfort and luxury in our well-appointed rooms."
                });
            }
        }
        console.log("Rooms created successfully");
        console.log("Database seeded!");
        process.exit(0);

    } catch (error) {
        console.error("Seeding Error:", error);
        process.exit(1);
    }
};

seedData();
