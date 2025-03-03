// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';

import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Quiz from './components/Quiz';
import UserContext from './UserContext';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Felhasználói adatok lekérdezése
    axios.get('/api/auth/profile')
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.error(err.response.data);
      });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
    <Router>
      {/* Navbar – fix 60px magas */}
      <Navbar />
      {/* Fő tartalom, ami kitölti a maradék helyet */}
      <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bejelentkezes" element={<Login />} />
            <Route path="/regisztracio" element={<Register />} />
            <Route path="/profil" element={<Profile />} />
            <Route path="/kviz" element={<Quiz/>} />
            </Routes>
      </div>
    </Router>
    </UserContext.Provider>
  );
}

export default App;
