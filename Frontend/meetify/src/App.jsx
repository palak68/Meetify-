import { useState } from 'react'
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import LandingPage from './pages/landing'
import './App.css'

function App() {
  
  return (
    <>
    <Router>

      <Routes>
        
         <Route path='/' element={<LandingPage />} />

      </Routes>
    </Router>
    </>
  )
}

export default App
