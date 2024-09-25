import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './components/contexts/userContext';
import { NavBar } from './components/NavBar';
import Home from './components/Home';
import About from './components/About';
import Experts from './components/Experts';
import Services from './components/Services';
import Login from './components/forms/Login';
import SignUp from './components/forms/Signup';



function AppContent() {
  return (
    <div className="flex-grow">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/experts" element={<Experts />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  )
}

const App = () => {
  return (
    <Router>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </Router>
  )
}

export default App

