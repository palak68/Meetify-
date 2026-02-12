import { useState } from 'react'
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import LandingPage from './pages/landing'
import Authentication from './pages/authentication'
import { AuthProvider } from './context/Authcontext'
import './App.css'

function App() {
  
  return (
    <>
    <Router>
<AuthProvider>
      <Routes>
        
         <Route path='/' element={<LandingPage />} />
        <Route path='/auth' element={<Authentication />} />

      </Routes></AuthProvider>
    </Router>
    </>
  )
}

export default App
