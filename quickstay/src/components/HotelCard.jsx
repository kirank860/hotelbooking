import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const HotelCard = ({ room, index }) => {
  return (
    <Link
      to={`/rooms/${room._id}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      key={room._id}
      className="block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      {/* Image */}
      <div className="relative w-full h-56 overflow-hidden">
        <img
          src={room.images[0]}
          alt={room.hotel.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {index % 2 === 0 && (
          <p className="absolute top-3 left-3 bg-white/90 text-gray-800 text-xs font-medium px-3 py-1 rounded-full shadow">
            Best Seller
          </p>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Hotel name + rating */}
        <div className="flex items-center justify-between">
          <h3 className="font-playfair text-lg font-semibold text-gray-800">
            {room.hotel.name}
          </h3>
          <div className="flex items-center gap-1 text-sm text-gray-700">
            <img
              src={assets.starIconFilled}
              alt="star-icon"
              className="w-4 h-4"
            />
            <span>4.5</span>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-center gap-1 mt-1 text-gray-500 text-sm">
          <img src={assets.locationIcon} alt="location-icon" className="w-4 h-4" />
          <span>{room.hotel.address}</span>
        </div>

        {/* Price + button */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-gray-800">
            <span className="text-xl font-semibold">${room.pricePerNight}</span>
            <span className="text-sm text-gray-500">/night</span>
          </p>
          <button className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-100 transition-all">
            Book Now
          </button>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;
