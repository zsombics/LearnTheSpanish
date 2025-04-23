import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';

import Home from './components/mainComponents/Home';
import Login from './components/mainComponents/Login';
import Register from './components/mainComponents/Register';
import Profile from './components/mainComponents/Profile';
import Quiz from './components/mainComponents/Quiz';
import UserContext from './UserContext';
import Navbar from './components/mainComponents/Navbar';
import ResetPassword from './components/mainComponents/ResetPassword';
import Community from './components/mainComponents/Community';
import MapGame from './components/mainComponents/MapGame';
import Level1 from './components/mainComponents/MapGame/CityLevels/Level1';
import Level2 from './components/mainComponents/MapGame/CityLevels/Level2';
import Level3 from './components/mainComponents/MapGame/CityLevels/Level3';
import Level4 from './components/mainComponents/MapGame/CityLevels/Level4';
// import Level5 from './components/mainComponents/MapGame/CityLevels/Level5';
// import Level6 from './components/mainComponents/MapGame/CityLevels/Level6';
// import Level7 from './components/mainComponents/MapGame/CityLevels/Level7';
// import Level8 from './components/mainComponents/MapGame/CityLevels/Level8';

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/auth/profile');
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div className="loading">Betöltés...</div>;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
};

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
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            
            {/* Védett útvonalak */}
            <Route 
              path="/profil" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/kviz" 
              element={
                <ProtectedRoute>
                  <Quiz />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/community" 
              element={
                <ProtectedRoute>
                  <Community />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/terkep" 
              element={
                <ProtectedRoute>
                  <MapGame />
                </ProtectedRoute>
              } 
            />
           
            <Route 
              path="/city-levels/level1" 
              element={
                <ProtectedRoute>
                  <Level1 />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/city-levels/level2" 
              element={
                <ProtectedRoute>
                  <Level2 />
                </ProtectedRoute>
              } 
            />
             
            <Route 
              path="/city-levels/level3" 
              element={
                <ProtectedRoute>
                  <Level3 />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/city-levels/level4" 
              element={
                <ProtectedRoute>
                  <Level4 />
                </ProtectedRoute>
              } 
            />
            {/* Városi szintek útvonalai 
            <Route 
              path="/city-levels/level5" 
              element={
                <ProtectedRoute>
                  <Level5 />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/city-levels/level6" 
              element={
                <ProtectedRoute>
                  <Level6 />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/city-levels/level7" 
              element={
                <ProtectedRoute>
                  <Level7 />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/city-levels/level8" 
              element={
                <ProtectedRoute>
                  <Level8 />
                </ProtectedRoute>
              } 
            />
            */}
          </Routes>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
