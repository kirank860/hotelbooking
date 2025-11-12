import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './Pages/Home'
import Footer from './components/Footer'
import AllRooms from './Pages/AllRooms'
import RoomDetails from './components/RoomDetails'
import Mybookings from './Pages/Mybookings'
import HotelReg from './components/HotelReg'
import Layout from './Pages/hotelOwner/Layout'
import DashBoard from './Pages/hotelOwner/DashBoard'
import AddRoom from './Pages/hotelOwner/AddRoom'
import ListRoom from './Pages/hotelOwner/ListRoom'

const App = () => {
  const isOwnerpath=useLocation().pathname.includes("owner")
  return (
    <div>
{ !isOwnerpath &&  <Navbar/>}
{false && <HotelReg/>}
<div className='min-h-[70vh]'>
   <Routes>
  <Route path='/' element={<Home/>}/>
  <Route path='/rooms' element={<AllRooms/>}/>
  <Route path='/rooms/:id' element={<RoomDetails/>}/>
  <Route path='/my-bookings' element={<Mybookings/>}/>
  <Route path='/owner' element={<Layout/>}>
<Route index element={<DashBoard/>} />
<Route path='add-room' element={<AddRoom/>} />
<Route path='list-room' element={<ListRoom/>} />
  </Route>
   </Routes>
</div>
<Footer/>
    </div>
  )
}

export default App