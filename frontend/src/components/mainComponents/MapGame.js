import React, { useState } from 'react';
import { motion } from 'framer-motion';
import '../../styles/MapGame.css';
import IntroScreen from './IntroScreen';

const cities = [
    { id: 1, name: 'Barcelona', x: 919, y: 274 },
    { id: 2, name: 'Valencia', x: 770, y: 452 },
    { id: 3, name: 'Sevilla', x: 456, y: 612 },
    { id: 4, name: 'Bilbao', x: 622, y: 144 },
    { id: 5, name: 'Zaragoza', x: 741, y: 275 },
    { id: 6, name: 'Málaga', x: 508, y: 668 },
    { id: 7, name: 'Granada', x: 584, y: 638 },
    { id: 8, name: 'Palma', x: 945, y: 444 },
    { id: 9, name: 'Madrid', x: 594, y: 413 }
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
                <div className="map-container">
                    <div className="spain-map" style={{ backgroundImage: 'url(/images/Spanyolorszag.png)' }}>
                        {cities.map((city) => (
                            <motion.div
                                key={city.id}
                                className={`city ${currentCity?.id === city.id ? 'active' : ''}`}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                style={{ left: `${city.x}px`, top: `${city.y}px` }}
                                onClick={() => handleCityClick(city)}
                            >
                                <div className="city-name">{city.name}</div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="game-info">
                        <h2>Jelenlegi város: {currentCity ? currentCity.name : 'Válassz egy várost!'}</h2>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MapGame;