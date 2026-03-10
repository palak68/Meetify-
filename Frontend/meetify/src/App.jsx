import { useState } from 'react'
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/landing";
import Authentication from "./pages/authentication";
import HomeComponent from "./pages/home";
import History from "./pages/history";
import VedioMeetComponent from "./pages/VedioMeet";
import { AuthProvider } from "./context/Authcontext";

import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Authentication />} />

          {/* After Login */}
          <Route path="/home" element={<HomeComponent />} />
          <Route path="/history" element={<History />} />

          {/* Meeting Route */}
          <Route path="/meet/:url" element={<VedioMeetComponent />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;