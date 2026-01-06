import React from 'react'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import Admin from '../pages/Admin'

const AppRoute = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
        </Routes>
    )
}

export default AppRoute