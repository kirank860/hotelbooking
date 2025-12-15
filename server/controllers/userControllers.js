// Get/api/user/    

export const getUserData = async (req, res) => {
    try {
        const user = await req.user.populate('savedRooms');
        const role = user.role;
        const recentSearchedCities = user.recentSearchedCities
        const savedRooms = user.savedRooms;
        res.json({ success: true, role, recentSearchedCities, savedRooms })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
// store user Recent searched cities
export const storeRecentSearchedCities = async (req, res) => {
    try {
        const { recentSearchedCity } = req.body
        const user = await req.user
        if (user.recentSearchedCities.length < 3) {
            user.recentSearchedCities.push(recentSearchedCity)
        } else {
            user.recentSearchedCities.shift();
            user.recentSearchedCities.push(recentSearchedCity);
        }
        await user.save();
        res.json({ success: true, message: "city added" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Toggle Wishlist
export const toggleWishlist = async (req, res) => {
    try {
        const { roomId } = req.body;
        const user = req.user;
        const roomIndex = user.savedRooms.indexOf(roomId);

        if (roomIndex === -1) {
            user.savedRooms.push(roomId);
            await user.save();
            res.json({ success: true, message: "Added to Wishlist", added: true });
        } else {
            user.savedRooms.splice(roomIndex, 1);
            await user.save();
            res.json({ success: true, message: "Removed from Wishlist", added: false });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};