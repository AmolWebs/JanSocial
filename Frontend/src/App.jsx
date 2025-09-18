import React from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import { JanProvider } from './context/JanContext'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Register from './pages/Register'
import OnePost from './pages/OnePost'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Profile from './pages/Profile'
import CreatePost from './pages/CreatePost'
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <JanProvider>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute>  <Home />  </ProtectedRoute>} />
        <Route path="/post/:id" element={<ProtectedRoute>  <OnePost />  </ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute>  <Profile />  </ProtectedRoute>} />  {/* Need to work on this  */}
        <Route path="/createPost" element={<ProtectedRoute>  <CreatePost />  </ProtectedRoute>} />
        
        
      </Routes>
      <Footer />
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </JanProvider>
  )
}

export default App
