// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';

import Home from './components/mainComponents/Home';
import Login from './components/mainComponents/Login';
import Register from './components/mainComponents/Register';
import Profile from './components/mainComponents/Profile';
import Quiz from './components/mainComponents/Quiz';
import UserContext from './UserContext';
import Navbar from './components/mainComponents/Navbar';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
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
      <Navbar />
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
