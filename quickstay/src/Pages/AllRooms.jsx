import React, { useEffect, useState } from 'react'
import { facilityIcons, assets } from '../assets/assets'
import { useNavigate, useSearchParams } from 'react-router-dom'
import StartRating from '../components/StartRating'
import { useAppcontext } from '../contest/AppContext';

const CheckBox = ({ label, selected = false, onChange = () => { } }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="checkbox"
        checked={selected}
        onChange={(e) => onChange(e.target.checked, label)}
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const AllRooms = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { navigate, currency, axios, wishlist, addToWishlist } = useAppcontext()

  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(false)
  const [openFilters, setOpenFilters] = useState(false)

  // Filter States
  const [maxPrice, setMaxPrice] = useState(3000)
  const [selectedAmenities, setSelectedAmenities] = useState([])
  const [selectedRoomTypes, setSelectedRoomTypes] = useState([])

  const roomsTypes = [
    "Single Bed", // Fixed typo "Singel Bed"
    "Double Bed",
    "Family Suite", // Fixed typo "Family Suit"
    "Luxury Room"
  ]

  const fetchFilteredRooms = async () => {
    setLoading(true)
    try {
      // Build Query
      const params = new URLSearchParams()
      params.append('minPrice', 0)
      params.append('maxPrice', maxPrice)
      if (selectedAmenities.length > 0) {
        params.append('amenities', selectedAmenities.join(','))
      }

      const { data } = await axios.get(`/api/rooms?${params.toString()}`)
      if (data.success) {
        // Client-side filtering for Room Type (since backend doesn't support it yet, or mixed approach)
        let filtered = data.rooms
        if (selectedRoomTypes.length > 0) {
          filtered = filtered.filter(room => selectedRoomTypes.includes(room.roomType))
        }
        setRooms(filtered)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Debounce Fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFilteredRooms()
    }, 500)
    return () => clearTimeout(timer)
  }, [maxPrice, selectedAmenities, selectedRoomTypes])


  const handleAmenityChange = (checked, value) => {
    setSelectedAmenities(prev => checked ? [...prev, value] : prev.filter(item => item !== value))
  }

  const handleRoomTypeChange = (checked, value) => {
    setSelectedRoomTypes(prev => checked ? [...prev, value] : prev.filter(item => item !== value))
  }

  return (
    <div className='flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32'>

      {/* Left Section - Heading and Description */}
      <div className='w-full lg:w-[75%] pr-4'>
        <div className='max-w-[700px]'>
          <h1 className='font-playfair text-4xl md:text-[40px]'>Hotel Rooms</h1>
          <p className='text-sm md:text-base text-gray-500/90 mt-2 max-w-[700px]'>
            Explore our range of premium rooms tailored for your comfort. Use filters to find your perfect stay.
          </p>
        </div>

        {/* Room List */}
        <div className='mt-10 flex flex-col gap-10'>
          {loading ? (
            <div className="flex justify-center py-20">Loading rooms...</div>
          ) : rooms.length > 0 ? (
            rooms.map((room) => (
              <div key={room._id} className='flex flex-col md:flex-row gap-6 items-start py-10 border-b border-gray-300 last:pb-30 last:border-0'>

                {/* Room Image */}
                <div className="relative md:w-1/2">
                  <img
                    onClick={() => { navigate(`/rooms/${room._id}`); window.scrollTo(0, 0) }}
                    src={room.images[0]}
                    alt='hotel-img'
                    title='View Room Details'
                    className='w-full max-h-52 rounded-xl shadow-lg object-cover cursor-pointer hover:scale-[1.02] transition-transform duration-300'
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); addToWishlist(room._id); }}
                    className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all transform hover:scale-110 active:scale-95"
                  >
                    <img
                      src={assets.heartIcon}
                      alt="wishlist"
                      className={`w-5 h-5 transition-colors ${wishlist.includes(room._id) ? 'invert-0 sepia-0 saturate-[5000%] hue-rotate-[320deg] brightness-90 contrast-125' : 'opacity-60'}`}
                      style={wishlist.includes(room._id) ? { filter: 'invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)' } : {}}
                    />
                  </button>
                </div>

                {/* Room Info */}
                <div className='md:w-1/2 flex flex-col gap-2'>
                  <p className='text-gray-500'>{room.hotel?.city || 'City'}</p>
                  <p
                    onClick={() => { navigate(`/rooms/${room._id}`); window.scrollTo(0, 0) }}
                    className='text-gray-800 text-3xl font-playfair cursor-pointer hover:text-blue-600 transition-colors'
                  >
                    {room.hotel?.name || 'Hotel Name'}
                  </p>

                  {/* Rating */}
                  <div className='flex items-center'>
                    <StartRating />
                    <p className='ml-2 text-sm text-gray-600'>200+ reviews</p>
                  </div>

                  {/* Location */}
                  <div className='flex items-center gap-1 text-gray-500 mt-2 text-sm'>
                    <img src={assets.locationIcon} alt='location-icon' className="w-4 h-4" />
                    <span>{room.hotel?.address}</span>
                  </div>

                  {/* Room Amenities */}
                  <div className='flex flex-wrap items-center mt-3 mb-6 gap-2'>
                    {room.amenities.slice(0, 4).map((item, index) => (
                      <div
                        key={index}
                        className='flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100'
                      >
                        <img
                          src={facilityIcons[item]}
                          alt={item}
                          className='w-4 h-4'
                        />
                        <p className='text-[10px] font-medium uppercase tracking-wide'>{item}</p>
                      </div>
                    ))}
                    {room.amenities.length > 4 && <span className="text-xs text-gray-500">+{room.amenities.length - 4} more</span>}
                  </div>
                  {/* Rooms price per night */}
                  <div className="flex items-end justify-between mt-auto">
                    <p className='text-xl font-bold text-gray-800'>${room.pricePerNight}<span className="text-sm font-normal text-gray-500">/night</span></p>
                    <button onClick={() => { navigate(`/rooms/${room._id}`); window.scrollTo(0, 0) }} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded shadow hover:bg-blue-700 transition">View Details</button>
                  </div>
                </div>

              </div>
            ))
          ) : (
            <div className="text-center py-20 text-gray-500">No rooms found matching your criteria.</div>
          )}
        </div>
      </div>

      {/* Right Section - Filters */}
      <div className='w-full lg:w-[25%] bg-white border border-gray-200 rounded-lg p-5 shadow-sm sticky top-28'>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-playfair text-xl font-semibold">Filters</h3>
          <button onClick={() => { setMaxPrice(3000); setSelectedAmenities([]); setSelectedRoomTypes([]) }} className="text-xs text-blue-600 hover:underline font-medium uppercase tracking-wider">Reset</button>
        </div>

        {/* Room Type Filter */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-2">Room Type</h4>
          {roomsTypes.map((type, index) => (
            <CheckBox key={index} label={type} selected={selectedRoomTypes.includes(type)} onChange={(checked) => handleRoomTypeChange(checked, type)} />
          ))}
        </div>

        {/* Price Slider */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-gray-700">Max Price</h4>
            <span className="text-sm font-semibold text-blue-600">${maxPrice}</span>
          </div>
          <input
            type="range"
            min="0"
            max="5000"
            step="50"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>$0</span>
            <span>$5000+</span>
          </div>
        </div>

        {/* Amenities Filter */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Amenities</h4>
          {Object.keys(facilityIcons).map((amenity, index) => (
            <CheckBox key={index} label={amenity} selected={selectedAmenities.includes(amenity)} onChange={(checked) => handleAmenityChange(checked, amenity)} />
          ))}
        </div>

      </div>
    </div>
  )
}

export default AllRooms
