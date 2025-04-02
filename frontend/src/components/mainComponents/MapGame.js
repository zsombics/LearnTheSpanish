import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../../styles/MapGame.css';
import IntroScreen from './MapGame/IntroScreen';
import CityView from './MapGame/CityView';
import { cities, getCityById } from './MapGame/cityData';

const LevelComponents = {
    Level1: React.lazy(() => import('../../components/Levels/Level1')),
    Level2: React.lazy(() => import('../../components/Levels/Level2')),
    Level3: React.lazy(() => import('../../components/Levels/Level3')),
    Level4: React.lazy(() => import('../../components/Levels/Level4')),
    Level5: React.lazy(() => import('../../components/Levels/Level5')),
    Level6: React.lazy(() => import('../../components/Levels/Level6')),
    Level7: React.lazy(() => import('../../components/Levels/Level7')),
    Level8: React.lazy(() => import('../../components/Levels/Level8')),
};

const MapGame = () => {
    const navigate = useNavigate();
    const [showIntro, setShowIntro] = useState(false);
    const [hoveredCityId, setHoveredCityId] = useState(null);
    const [selectedCityData, setSelectedCityData] = useState(null);
    const [inCityView, setInCityView] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [isTooltipHovered, setIsTooltipHovered] = useState(false);

    useEffect(() => {
        const hasSeenIntro = localStorage.getItem('hasSeenIntro');
        if (!hasSeenIntro) {
            setShowIntro(true);
        }
    }, []);

    const handleStartGame = () => {
        setShowIntro(false);
        localStorage.setItem('hasSeenIntro', 'true');
    };

    const handleCityMouseEnter = (city, event) => {
        if (city.id !== 9 && city.artist) {
            setHoveredCityId(city.id);
            setTooltipPosition({ x: event.clientX, y: event.clientY });
        }
    };

    const handleCityMouseLeave = () => {
        if (!isTooltipHovered) {
            setTimeout(() => {
                setHoveredCityId(null);
            }, 2000);
        }
    };

    const handleTooltipMouseEnter = () => {
        setIsTooltipHovered(true);
    };

    const handleTooltipMouseLeave = () => {
        setIsTooltipHovered(false);
        setHoveredCityId(null);
    };

    const handleEnterCity = (cityId) => {
        const cityData = getCityById(cityId);
        if (cityData && cityData.artist) {
            setSelectedCityData(cityData);
            setInCityView(true);
            setHoveredCityId(null);
        } else if (cityId === 9) {
            setSelectedCityData(cityData);
            setInCityView(false);
            console.log("Madrid kiválasztva - speciális feladatok jönnek?");
        }
    };

    const handleExitCity = () => {
        setInCityView(false);
        setSelectedCityData(null);
    };

    const handleGoToTests = (levelCompName) => {
        if (levelCompName) {
            navigate(`/levels/${levelCompName.toLowerCase()}`);
        } else {
            console.warn("Nincs megadva vagy nem található szint komponens:", levelCompName);
        }
    };

    const hoveredCityData = hoveredCityId ? getCityById(hoveredCityId) : null;

    return (
        <div className="map-game-container">
            {showIntro ? (
                <IntroScreen onStartGame={handleStartGame} />
            ) : (
                <AnimatePresence mode="wait">
                    {!inCityView ? (
                        <motion.div
                            key="map-view"
                            className="map-section"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1>Leo Kalandja Spanyolországban</h1>
                            <div className="map-wrapper">
                                <div className="map-container">
                                    <div className="spain-map" style={{ backgroundImage: 'url(/images/Spanyolorszag.png)' }}>
                                        {cities.map((city) => (
                                            <motion.div
                                                key={city.id}
                                                className={`city ${selectedCityData?.id === city.id ? 'selected' : ''}`}
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: 0.2, duration: 0.4 }}
                                                style={{ left: `${city.x}px`, top: `${city.y}px` }}
                                                onClick={() => handleEnterCity(city.id)}
                                                onMouseEnter={(e) => handleCityMouseEnter(city, e)}
                                                onMouseLeave={handleCityMouseLeave}
                                                whileHover={{ scale: 1.15, zIndex: 100 }}
                                            >
                                                <div className="city-pin"></div>
                                                {!hoveredCityId && <div className="city-name-static">{city.name}</div>}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                                <AnimatePresence>
                                {hoveredCityData && (
                                    <motion.div
                                        className="city-tooltip"
                                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                                        transition={{ duration: 0.2 }}
                                        style={{
                                            left: `${tooltipPosition.x + 15}px`,
                                            top: `${tooltipPosition.y + 15}px`,
                                            position: 'fixed',
                                            transform: 'translate(-50%, 0)',
                                        }}
                                        onMouseEnter={handleTooltipMouseEnter}
                                        onMouseLeave={handleTooltipMouseLeave}
                                    >
                                        <img src={hoveredCityData.image} alt={hoveredCityData.name} className="tooltip-image"/>
                                        <h3>{hoveredCityData.name}</h3>
                                        <p>{hoveredCityData.description}</p>
                                        <button onClick={() => handleEnterCity(hoveredCityData.id)} className="tooltip-button">
                                            Belépés a városba
                                        </button>
                                    </motion.div>
                                )}
                                </AnimatePresence>
                            </div>
                            <div className="game-info map-info">
                                <h2>{selectedCityData ? `Legutóbbi helyszín: ${selectedCityData.name}` : 'Fedezd fel Spanyolországot!'}</h2>
                                <p>Vidd az egeret egy város fölé, vagy kattints a belépéshez.</p>
                            </div>
                        </motion.div>
                    ) : (
                        <CityView
                            cityData={selectedCityData}
                            onExit={handleExitCity}
                        />
                    )}
                </AnimatePresence>
            )}
        </div>
    );
};

export default MapGame;