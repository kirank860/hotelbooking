import React, { useMemo } from 'react'
import { useAppcontext } from '../contest/AppContext'
import Title from '../components/Title'
import { assets, facilityIcons } from '../assets/assets'
import StartRating from '../components/StartRating'

const SavedRooms = () => {
    const { navigate, wishlist, addToWishlist, rooms } = useAppcontext()

    const savedRoomsList = useMemo(() => {
        return rooms.filter(room => wishlist.includes(room._id))
    }, [rooms, wishlist])

    return (
        <div className='pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32'>
            <Title title="Saved Rooms" subTitle="Your favorite stays are saved here." align="left" />

            <div className='mt-10 flex flex-col gap-10 min-h-[50vh]'>
                {savedRoomsList.length > 0 ? (
                    savedRoomsList.map((room) => (
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

                                <div className='flex items-center'>
                                    <StartRating />
                                    <p className='ml-2 text-sm text-gray-600'>200+ reviews</p>
                                </div>

                                <div className='flex items-center gap-1 text-gray-500 mt-2 text-sm'>
                                    <img src={assets.locationIcon} alt='location-icon' className="w-4 h-4" />
                                    <span>{room.hotel?.address}</span>
                                </div>

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
                                </div>
                                <div className="flex items-end justify-between mt-auto">
                                    <p className='text-xl font-bold text-gray-800'>${room.pricePerNight}<span className="text-sm font-normal text-gray-500">/night</span></p>
                                    <button onClick={() => { navigate(`/rooms/${room._id}`); window.scrollTo(0, 0) }} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded shadow hover:bg-blue-700 transition">View Details</button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                        <img src={assets.heartIcon} alt="No saved rooms" className="w-16 h-16 opacity-20 mb-4" />
                        <h3 className="text-xl font-medium text-gray-800">No rooms saved yet</h3>
                        <p className="text-gray-500 mt-2 mb-6">Start exploring and save your favorite stays!</p>
                        <button onClick={() => navigate('/rooms')} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Explore Rooms</button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SavedRooms
