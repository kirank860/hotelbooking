
import Hotel from "../models/Hotel.js";
import { v2 as cloudinary } from "cloudinary"
import { json } from "express";
import Room from "../models/Room.js";
export const createRoom = async (req, res) => {
  try {
    console.log("Received create room request:", req.body);
    const { roomType, pricePerNight, amenities } = req.body;
    const hotel = await Hotel.findOne({ owner: req.auth.userId })
    if (!hotel) {
      console.log("No hotel found for user:", req.auth.userId);
      return res.json({ success: false, message: "no hotel found" })
    }
    const uploadImages = req.files.map(async (file) => {
      const response = await cloudinary.uploader.upload(file.path)
      return response.secure_url
    })
    const images = await Promise.all(uploadImages)
    await Room.create({
      hotel: hotel._id,
      roomType,
      pricePerNight: +pricePerNight,
      amenities: JSON.parse(amenities),
      images,
    })
    res.json({ success: true, message: "Room created successfully" })
  } catch (error) {
    console.error("Create room error:", error);
    res.json({ success: false, message: error.message })
  }
}
export const getRooms = async (req, res) => {
  try {
    const { minPrice, maxPrice, amenities } = req.query;
    const filter = { isAvailable: true };

    if (minPrice || maxPrice) {
      filter.pricePerNight = {};
      if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
    }

    if (amenities) {
      const amenitiesList = amenities.split(',').filter(a => a);
      if (amenitiesList.length > 0) {
        filter.amenities = { $all: amenitiesList };
      }
    }

    const rooms = await Room.find(filter).populate({
      path: 'hotel',
      populate: {
        path: 'owner',
        select: 'image'
      }
    }).sort({ createdAt: -1 });

    res.json({ success: true, rooms });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
// function to get all rooms with filters
export const getAllRooms = async (req, res) => {
  try {
    const { minPrice, maxPrice, amenities } = req.query;
    const filter = {};

    if (minPrice || maxPrice) {
      filter.pricePerNight = {};
      if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
    }

    if (amenities) {
      const amenitiesList = amenities.split(',').filter(a => a); // Ensure no empty strings
      if (amenitiesList.length > 0) {
        filter.amenities = { $all: amenitiesList }; // Room must have ALL selected amenities
      }
    }

    const rooms = await Room.find(filter).populate("hotel");
    res.json({ success: true, rooms });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
export const getOwnerRooms = async (req, res) => {
  try {
    const hotelData = await Hotel.findOne({ owner: req.auth.userId });
    const rooms = await Room.find({ hotel: hotelData._id.toString() }).populate("hotel");
    res.json({ success: true, rooms });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
export const toggleRoomAvailability = async (req, res) => {
  try {
    const { roomId } = req.body;
    const roomData = await Room.findById(roomId);
    roomData.isAvailable = !roomData.isAvailable;
    await roomData.save();
    res.json({ success: true, message: "Room availability Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};