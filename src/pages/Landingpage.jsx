import React from 'react'
import Navbar from '../components/navbar'
import { Outlet } from 'react-router-dom'
import Cart from '../components/Cart'
import Productpage from '../components/Productpage'

const Landingpage = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  )
}

export default Landingpage
