import React, { useMemo, useState } from 'react'
import { roomsDummyData, assets, facilityIcons } from '../assets/assets'
import { useNavigate, useParams } from 'react-router-dom'
import StartRating from '../components/StartRating'
import { useAppcontext } from '../contest/AppContext';

const CheckBox = ({ label, selected = false, onChange = () => {} }) => {
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
const RadioButton = ({ label, selected = false, onChange = () => {} }) => {
    return (
      <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
        <input
          type="radio"
          name='sortOption'
          checked={selected}
          onChange={() => onChange( label)}
        />
        <span className="font-light select-none">{label}</span>
      </label>
    );
  };
  
const AllRooms = () => {
  const [searchParams,setSearchParams]=useParams()
  const {rooms,navigate,currency}=useAppcontext()

const [openFilters,setOpenFilters]=useState(false)
const [selectedFilters,setSelectedFilters]=useState({
  roomsType:[],
  priceRange:[],

})
const [selectedSort,setSelectedSort]=useState("")
const roomsTypes=[
    "Singel Bed",
    "Double Bed",
    "Family Suit",
    "Luxury Room"
]
const priceRange=[
    "0 to 500",
    "500 to 1000",
    "1000 to 2000",
    "2000 to 3000"
]
const sortOption=[
    "price low to high",
    "price high to low",
    "Newset First"
]
const handleFilterChange=(checked,value,type)=>{
setSelectedFilters((prevFilters)=>{
const updatedFilters={...prevFilters}
if(checked){
  updatedFilters[type].push(value)
}else{
  updatedFilters[type]=updatedFilters[type].filter(item=>item !==value)
}
return updatedFilters
})
}
const handleSortChange=(sortOption)=>{
setSelectedSort(sortOption)
}
const matchesRoomType=(room)=>{
  return selectedFilters.roomsType.length===0 ||selectedFilters.roomsType.includes(room.roomsType)
}
const matchesPriceRange=(room)=>{
  return selectedFilters.priceRange.length===0 ||selectedFilters.priceRange.some(range=>{
    const [min,max]=range.split('to').map(Number)
    return room.pricePerNight >= min && room.pricePerNight <=max;
  })
}
const sortRooms=(a,b)=>{
  if(selectedSort==='price Low to High'){
    return a.pricePerNight - b.pricePerNight
  } if(selectedSort==='price high to low'){
    return b.pricePerNight - a.pricePerNight
  } if(selectedSort==='Newst first'){
      return new Date(b.createdAt)-new Date(a.createdAt)
  }
  return 0
}
// Filter Destination
const filterDestination = (room) => {
  const destination = searchParams.get('destination');
  if(!destination) return true;
  return room.hotel.city.toLowerCase().includes(destination.toLowerCase())
}

// Filter and sort rooms based on the selected filters and sort option
const filteredRooms = useMemo(()=>{
  return rooms.filter(room => matchesRoomType(room) && matchesPriceRange
  (room) && filterDestination(room)).sort(sortRooms);
},[rooms, selectedFilters, selectedSort, searchParams])

// Clear all filters
const clearFilters = () => {
  setSelectedFilters({
      roomType: [],
      priceRange: [],
  });
  setSelectedSort('');
  setSearchParams({});
}
  return (
    <div className='flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32'>
      
      {/* Left Section - Heading and Description */}
      <div>
        <div className='max-w-[700px]'>
          <h1 className='font-playfair text-4xl md:text-[40px]'>Hotel Rooms</h1>
          <p className='text-sm md:text-base text-gray-500/90 mt-2 max-w-[700px]'>
            Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories.
          </p>
        </div>

        {/* Room List */}
        <div className='mt-10 flex flex-col gap-10'>
          {filteredRooms.map((room) => (
            <div key={room._id} className='flex flex-col md:flex-row gap-6 items-start py-10 border-b border-gray-300 last:pb-30 last-border-0'>
              
              {/* Room Image */}
              <img
                onClick={() => { navigate(`/rooms/${room._id}`); window.scrollTo(0, 0) }}
                src={room.images[0]}
                alt='hotel-img'
                title='View Room Details'
                className='max-h-52 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer'
              />

              {/* Room Info */}
              <div className='md:w-1/2 flex flex-col gap-2'>
                <p className='text-gray-500'>{room.hotel.city}</p>
                <p
                  onClick={() => { navigate(`/rooms/${room._id}`); window.scrollTo(0, 0) }}
                  className='text-gray-800 text-3xl font-playfair cursor-pointer'
                >
                  {room.hotel.name}
                </p>

                {/* Rating */}
                <div className='flex items-center'>
                     <StartRating/>
                  <p className='ml-2'>200+ reviews</p>
                </div>

                {/* Location */}
                <div className='flex items-center gap-1 text-gray-500 mt-2 text-sm'>
                  <img src={assets.locationIcon} alt='location-icon' />
                  <span>{room.hotel.address}</span>
                </div>

                {/* Room Amenities */}
                <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
                  {room.amenities.map((item, index) => (
                    <div
                      key={index}
                      className='flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70'
                    >
                      <img
                        src={facilityIcons[item]}
                        alt={item}
                        className='w-5 h-5'
                      />
                      <p className='text-xs'>{item}</p>
                    </div>
                  ))}
                </div>
                {/* Rooms price per night */}
                <p className='text-xl font-medium text-gray-700'>${room.pricePerNight}/night</p>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Right Section - Filters */}
      <div className='bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 min-lg:mt-16'>
        {/* Filters will go here */}
        <div
  className={`flex items-center justify-between px-5 py-2.5 min-lg:border-b border-gray-300 ${openFilters && "border-b"}`}
>

            <p className='text-base font-medium text-gary-800'>Filter</p>
            <div className='text-xs cursor-pointer'>
    <span onClick={()=>setOpenFilters(!openFilters)} className='lg:hidden'>{openFilters?'HIDE':"SHOW"} HIDE</span>
    <span className='hidden lg:block'>CLEAR</span>
            </div>
        </div>
        <div className={`${openFilters?'h-auto':"h-0 lg:h-auto"} overflow-hidden transition-all duration-700`}>
         <div className='px-5 pt-5'>
     <p className='font-medium text-gray-800 pb-2'>popular filters</p>
     {roomsTypes.map((room,index)=>(
        <CheckBox key={index} label={room} selected={selectedFilters.roomsType.includes(room)} onChange={(checked)=>handleFilterChange(checked,room,"roomType")}/>
     ))}
         </div>
         <div className='px-5 pt-5'>
     <p className='font-medium text-gray-800 pb-2'>Price range</p>
     {priceRange.map((range,index)=>(
        <CheckBox key={index} label={`$${currency} ${range}`} selected={selectedFilters.priceRange.includes(range)} onChange={(checked)=>handleFilterChange(checked,range,"priceRange")}/>
     ))}
         </div>
         <div className='px-5 pt-5 pb-5'>
     <p className='font-medium text-gray-800 pb-2'>sort by</p>
     {sortOption.map((option,index)=>(
<RadioButton key={index} label={option} selected={selectedSort===option} onChange={()=>handleSortChange((option))}/>
     ))}
         </div>
        </div>
      </div>
    </div>
  )
}

export default AllRooms
