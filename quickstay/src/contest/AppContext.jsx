import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useUser, useAuth } from "@clerk/clerk-react"
import { createContext, useContext, useEffect, useState } from "react"
import toast from "react-hot-toast"

// Fix: Use process.env instead of import.meta.env for Create React App
axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL

const AppContext = createContext()

export const AppProvider = ({ children }) => { // Fix: typo "childern" -> "children"
    const currency = process.env.REACT_APP_CURRENCY || "$" // Fix: Use process.env
    const navigate = useNavigate()
    const { user } = useUser();
    const { getToken } = useAuth()
    const [isOwner, setIsOwner] = useState(false)
    const [showHotelReg, setShowHotelReg] = useState(false)
    const [searchedCities, setSearchedCities] = useState([])
    const [rooms, setRooms] = useState([])
    const [wishlist, setWishlist] = useState([])

    const fetchRooms = async () => {
        try {
            const { data } = await axios.get('/api/rooms')
            if (data.success) {
                setRooms(data.rooms)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/api/user', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            })
            if (data.success) {
                setIsOwner(data.role === "hotelOwner")
                setSearchedCities(data.recentSearchedCities || [])
                const saved = data.savedRooms || [];
                setWishlist(saved.map(r => r._id))
            } else {
                setTimeout(() => {
                    fetchUser()
                }, 5000);
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const addToWishlist = async (roomId) => {
        try {
            const { data } = await axios.post('/api/user/toggle-wishlist', { roomId }, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            })
            if (data.success) {
                if (data.added) {
                    toast.success(data.message)
                    setWishlist(prev => [...prev, roomId])
                } else {
                    toast.success(data.message)
                    setWishlist(prev => prev.filter(id => id !== roomId))
                }
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (user) {
            fetchUser()
        }
    }, [user])

    useEffect(() => {
        fetchRooms()
    }, [])

    const value = {
        currency,
        navigate,
        user,
        getToken,
        isOwner,
        setIsOwner,
        showHotelReg,
        setShowHotelReg,
        axios,
        searchedCities,
        setSearchedCities,
        rooms, setRooms,
        wishlist, setWishlist,
        addToWishlist,
        toast
    }

    return (
        <AppContext.Provider value={value}>
            {children} {/* Fix: typo "childern" -> "children" */}
        </AppContext.Provider>
    )
}

export const useAppcontext = () => useContext(AppContext)

