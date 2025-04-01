import React, { useState } from 'react';
import { motion } from 'framer-motion';
import '../../styles/MapGame.css';
import IntroScreen from './IntroScreen';

const cities = [
    { id: 1, name: 'Barcelona', x: 906, y: 243 },
    { id: 2, name: 'Valencia', x: 747, y: 421 },
    { id: 3, name: 'Sevilla', x: 445, y: 578 },
    { id: 4, name: 'Bilbao', x: 609, y: 113 },
    { id: 5, name: 'Zaragoza', x: 728, y: 244 },
    { id: 6, name: 'Málaga', x: 496, y: 635 },
    { id: 7, name: 'Granada', x: 571, y: 607 },
    { id: 8, name: 'Palma', x: 932, y: 413 },
    { id: 9, name: 'Madrid', x: 581, y: 382 }
];

const MapGame = () => {
    const [currentCity, setCurrentCity] = useState(null);
    const [showIntro, setShowIntro] = useState(true);

    const handleCityClick = (city) => {
        setCurrentCity(city);
    };

    const handleStartGame = () => {
        console.log("handleStartGame called in MapGame");
        setShowIntro(false);
    };

    return (
        <div className="map-game-container">
            {showIntro ? (
                <IntroScreen onStartGame={handleStartGame} />
            ) : (
                <div className="map-section">
                    <h1>Leo Kalandja Spanyolországban</h1>
                    <div className="map-wrapper">
                        <div className="map-container">
                            <div className="spain-map" style={{ backgroundImage: 'url(/images/Spanyolorszag.png)' }}>
                                {cities.map((city) => (
                                    <motion.div
                                        key={city.id}
                                        className="city"
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.3 }}
                                        style={{ left: `${city.x}px`, top: `${city.y}px` }}
                                        onClick={() => handleCityClick(city)}
                                        whileHover={{ scale: 1.5 }}
                                    >
                                        <div className="city-pin"></div>
                                        <div className="city-name">{city.name}</div>
                                    </motion.div>
                                ))}
                                {currentCity && (
                                    <motion.div
                                        className="character"
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                        style={{ left: `${currentCity.x}px`, top: `${currentCity.y}px` }}
                                    >
                                        <div className="character-name">{currentCity.name}</div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="game-info">
                        <h2>{currentCity ? `Aktuális helyszín: ${currentCity.name}` : 'Indulj el egy városba!'}</h2>
                        {!currentCity && <p>Kattints egy városra a térképen a kezdéshez.</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MapGame;
