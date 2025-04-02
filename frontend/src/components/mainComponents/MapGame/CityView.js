import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../../styles/MapGame.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CityView = ({ cityData, onExit }) => {
    const navigate = useNavigate();
    const [testProgress, setTestProgress] = useState({ current: 0, total: 10 });
    const [showPassword, setShowPassword] = useState(false);
    const [isPressingPassword, setIsPressingPassword] = useState(false);
    const [passwordRevealed, setPasswordRevealed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const passwordRevealTimeout = useRef(null);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const response = await axios.get('/api/eredmenyek');
                const levelResults = response.data
                    .filter(result => result.level === cityData.levelComponent)
                    .slice(-10);

                const correctResults = levelResults.filter(result => result.ratio === 1).length;

                setTestProgress({
                    current: correctResults,
                    total: 10
                });

                setPasswordRevealed(correctResults === 10);
            } catch (error) {
                console.error('Hiba a haladás betöltésekor:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProgress();
    }, [cityData.id, cityData.levelComponent]);

    useEffect(() => {
        setShowPassword(false);
        setIsPressingPassword(false);
        setTestProgress({ current: 0, total: 10 });
        setPasswordRevealed(false);
        clearTimeout(passwordRevealTimeout.current);
    }, [cityData]);

    const handlePasswordButtonMouseDown = async () => {
        if (testProgress.current < testProgress.total) {
            console.log("A jelszó csak 10/10 helyes eredmény után érhető el!");
            return;
        }

        setIsPressingPassword(true);
        passwordRevealTimeout.current = setTimeout(async () => {
            if (!passwordRevealed) {
                try {
                    await axios.put(`/api/game/reveal-password/${cityData.id}`);
                    setPasswordRevealed(true);
                } catch (error) {
                    console.error('Hiba a jelszó felfedésekor:', error);
                }
            }
            setShowPassword(true);
            setIsPressingPassword(false);
        }, 1500);
    };

    const handlePasswordButtonMouseUpOrLeave = () => {
        clearTimeout(passwordRevealTimeout.current);
        setIsPressingPassword(false);
    };

    useEffect(() => {
        return () => {
            clearTimeout(passwordRevealTimeout.current);
        };
    }, []);

    const handleGoToTests = () => {
        if (cityData.levelComponent) {
            navigate(`/city-levels/${cityData.levelComponent.toLowerCase()}`);
        }
    };

    if (!cityData || isLoading) return null;

    return (
        <motion.div
            key="city-view"
            className="city-view-container"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${cityData.image})` }}
        >
            <button onClick={onExit} className="back-to-map-button">← Vissza a térképre</button>

            <div className="city-content-wrapper">
                <div className="artist-section">
                    <img
                        src={cityData.artist.image}
                        alt={cityData.artist.name}
                        className="artist-image"
                    />
                    <h3>{cityData.artist.name}</h3>
                    <p className="artist-info-text">{cityData.artist.info}</p>
                </div>

                <div className="task-section">
                    <h2>A feladat itt: {cityData.name}</h2>
                    <div className="dialogue-box">
                        <p>{cityData.artist.dialogue}</p>
                    </div>

                    <div className="progress-section">
                        <h3>Haladás:</h3>
                        <div className="progress-bar-container">
                            <div
                                className="progress-bar-fill"
                                style={{ width: `${(testProgress.current / testProgress.total) * 100}%` }}
                            ></div>
                            <span className="progress-bar-text">
                                {testProgress.current} / {testProgress.total}
                            </span>
                        </div>
                    </div>

                    <div className="action-buttons">
                        <button
                            onClick={handleGoToTests}
                            className="action-button tests-button"
                            disabled={!cityData.levelComponent}
                        >
                            Irány a Tesztek!
                        </button>

                        {cityData.password && (
                            <button
                                className={`action-button password-button ${isPressingPassword ? 'pressing' : ''} ${passwordRevealed ? 'revealed' : ''}`}
                                onMouseDown={handlePasswordButtonMouseDown}
                                onMouseUp={handlePasswordButtonMouseUpOrLeave}
                                onMouseLeave={handlePasswordButtonMouseUpOrLeave}
                                disabled={testProgress.current < testProgress.total}
                            >
                                {isPressingPassword ? 'Tartsd nyomva...' :
                                 passwordRevealed ? 'Jelszó megjelenítése' :
                                 `Jelszó felfedése (${testProgress.current}/10)`}
                            </button>
                        )}
                    </div>

                    <AnimatePresence>
                        {showPassword && cityData.password && (
                            <motion.div
                                className="password-display"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                            >
                                A titkos szó: <strong>{cityData.password}</strong>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </div>
        </motion.div>
    );
};

export default CityView;