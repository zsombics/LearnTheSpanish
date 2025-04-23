import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Levels.css';

export function parseCSV(data) {
    if (!data || !data.trim()) {
        return [];
    }
    const lines = data.trim().split("\n");
    return lines
        .map(line => line.split(","))
        .filter(parts => parts.length === 3)
        .map(parts => ({
            english: parts[0]?.trim() || '',
            spanish: parts[1]?.trim() || '',
            hungarian: parts[2]?.trim() || ''
        }))
        .filter(word => word.spanish && word.hungarian);
}

const CITY_ID = 1;
const LEVEL_NAME = 'Level1';

function Level1() {
    const navigate = useNavigate();
    const [numQuestions, setNumQuestions] = useState(10);
    const [direction, setDirection] = useState("spanyol-magyar");
    const [testStarted, setTestStarted] = useState(false);
    const [allWords, setAllWords] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [userAnswers, setUserAnswers] = useState({});
    const [testFinished, setTestFinished] = useState(false);
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (testStarted && allWords.length === 0) {
            setIsLoading(true);
            setError(null);
            fetch('/palabras3.csv')
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP hiba! Státusz: ${response.status}`);
                    return response.text();
                })
                .then(text => {
                    const words = parseCSV(text);
                    if (words.length === 0) throw new Error("Nem sikerült szavakat betölteni a CSV-ből.");
                    setAllWords(words);
                    generateQuestions(words);
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error("CSV betöltési hiba:", err);
                    setError("Hiba történt a szavak betöltése közben. Próbáld újra később.");
                    setIsLoading(false);
                    setTestStarted(false);
                });
        }
    }, [testStarted, allWords.length, numQuestions]);

    const generateQuestions = (words) => {
        const availableWords = [...words];
        const selectedQuestions = [];
        const usedIndices = new Set();

        if (availableWords.length < Math.max(4, numQuestions)) {
            console.warn("Nincs elég szó a CSV-ben a teszt generálásához!");
            setError("Nincs elég különböző szó a teszt összeállításához.");
            setTestStarted(false);
            setQuestions([]);
            return;
        }

        for (let i = 0; i < numQuestions; i++) {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * availableWords.length);
            } while (usedIndices.has(randomIndex) && usedIndices.size < availableWords.length);

            if (usedIndices.size >= availableWords.length) break;

            usedIndices.add(randomIndex);
            const word = availableWords[randomIndex];

            const questionText = direction === "spanyol-magyar" ? word.spanish : word.hungarian;
            const correctAnswer = direction === "spanyol-magyar" ? word.hungarian : word.spanish;

            const options = new Set([correctAnswer]);
            while (options.size < 4 && options.size < availableWords.length) {
                const randIdx = Math.floor(Math.random() * availableWords.length);
                if (randIdx !== randomIndex) {
                    const candidate = direction === "spanyol-magyar" ? availableWords[randIdx].hungarian : availableWords[randIdx].spanish;
                    if (candidate && !options.has(candidate)) {
                        options.add(candidate);
                    }
                }
            }
            const optionsArray = Array.from(options).sort(() => Math.random() - 0.5);
            selectedQuestions.push({ question: questionText, correctAnswer, options: optionsArray, originalWord: word });
        }
        if (selectedQuestions.length < numQuestions) {
            console.warn(`Csak ${selectedQuestions.length} kérdést sikerült generálni ${numQuestions} helyett.`);
            if (selectedQuestions.length < 1) {
                setError("Nem sikerült kérdéseket generálni.");
                setTestStarted(false);
                setQuestions([]);
                return;
            }
        }
        setQuestions(selectedQuestions);
        setError(null);
    };

    const startTest = () => {
        restartTestInternal();
        setTestStarted(true);
    };

    const handleOptionSelect = (option) => {
        if (showFeedback) return;
        setSelectedOption(option);
    };

    const handleNextQuestion = () => {
        if (selectedOption === null) {
            alert("Kérlek, válassz egy lehetőséget!");
            return;
        }

        const updatedAnswers = {
            ...userAnswers,
            [currentQuestionIndex]: selectedOption
        };

        setUserAnswers(updatedAnswers);
        setShowFeedback(true);

        setTimeout(() => {
            setShowFeedback(false);
            setSelectedOption(null);

            if (currentQuestionIndex === questions.length - 1) {
                finishTest(updatedAnswers);
            } else {
                setCurrentQuestionIndex(prev => prev + 1);
            }
        }, 2000);
    };

    const finishTest = (finalUserAnswers) => {
        setIsLoading(true);
        setError(null);

        let finalScore = 0;
        if (questions && questions.length > 0) {
            for (let i = 0; i < questions.length; i++) {
                if (finalUserAnswers.hasOwnProperty(i) && finalUserAnswers[i] === questions[i].correctAnswer) {
                    finalScore++;
                }
            }
        } else {
            console.error("Hiba a pontszámításkor: A 'questions' tömb üres vagy érvénytelen.");
            setError("Hiba történt a pontszám kiszámítása közben.");
            setIsLoading(false);
            setTestFinished(true);
            setResult({ score: 0, total: 0, level: LEVEL_NAME, saveError: true });
            return;
        }

        const ratio = questions.length > 0 ? finalScore / questions.length : 0;

        const payload = {
            answers: finalUserAnswers,
            level: LEVEL_NAME,
            cityId: CITY_ID,
            totalQuestions: questions.length,
            correctAnswers: finalScore,
            ratio: ratio,
            quizCompleted: true,
            direction: direction
        };

        console.log("Küldendő payload:", payload);

        axios.post('/api/eredmenyek/submit', payload, { withCredentials: true })
            .then(response => {
                console.log("Eredmény sikeresen mentve:", response.data);
                setResult({
                    score: finalScore,
                    total: questions.length,
                    level: LEVEL_NAME
                });
                setTestFinished(true);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Hiba a kvíz mentésekor:", err.response?.data || err.message);
                setError("Hiba történt az eredmény mentésekor.");
                setIsLoading(false);
                setResult({
                    score: finalScore,
                    total: questions.length,
                    level: LEVEL_NAME,
                    saveError: true
                });
                setTestFinished(true);
            });
    };

    const restartTestInternal = () => {
        setTestStarted(false);
        setAllWords([]);
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setShowFeedback(false);
        setUserAnswers({});
        setTestFinished(false);
        setResult(null);
        setIsLoading(false);
        setError(null);
    }

    const startNewTestSetup = () => {
        restartTestInternal();
        setTestStarted(false);
    };

    const goBackToMap = () => {
        navigate(-1);
    };

    if (!testStarted) {
        return (
            <div className="level-container test-setup">
                {error && <div className="error-message setup-error">{error}</div>}
                <h1>{LEVEL_NAME}: Teszt Beállítások (Barcelona)</h1>
                <div className="setup-group">
                    <label htmlFor="numQuestions">Hány kérdés legyen?</label>
                    <select id="numQuestions" value={numQuestions} onChange={(e) => setNumQuestions(Number(e.target.value))}>
                        {[5, 10, 15, 20].map(num => <option key={num} value={num}>{num}</option>)}
                        {allWords.length >= 25 && <option value={25}>25</option>}
                        {allWords.length >= 50 && <option value={50}>50</option>}
                    </select>
                </div>
                <div className="setup-group">
                    <label htmlFor="direction">Teszt iránya:</label>
                    <select id="direction" value={direction} onChange={(e) => setDirection(e.target.value)}>
                        <option value="spanyol-magyar">Spanyol → Magyar</option>
                        <option value="magyar-spanyol">Magyar → Spanyol</option>
                    </select>
                </div>
                <div className="setup-actions">
                    <button className="start-test-btn" onClick={startTest} disabled={isLoading}>
                        {isLoading ? "Indítás..." : "Teszt indítása"}
                    </button>
                    <button className="back-btn" onClick={goBackToMap}>Vissza a térképre</button>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return <div className="level-container loading">Szavak és kérdések betöltése/generálása...</div>;
    }

    if (!isLoading && questions.length === 0 && error) {
        return (
            <div className="level-container error-container">
                <h1>Hiba</h1>
                <p className="error-message">{error}</p>
                <button className="back-btn" onClick={startNewTestSetup}>Vissza a beállításokhoz</button>
            </div>
        );
    }

    if (!isLoading && questions.length === 0 && !error) {
        return (
            <div className="level-container error-container">
                <h1>Hiba</h1>
                <p className="error-message">Nem sikerült kérdéseket generálni. Lehet, hogy nincs elég megfelelő adat a forrásfájlban ehhez a teszttípushoz vagy kérdésszámhoz.</p>
                <button className="back-btn" onClick={startNewTestSetup}>Vissza a beállításokhoz</button>
            </div>
        );
    }

    if (testFinished && result) {
        return (
            <div className="level-container test-results">
                <h1>Eredmény ({LEVEL_NAME} - Barcelona)</h1>
                {result.saveError && <p className="error-message">Figyelem: Az eredmény helyben látható, de a mentés a szerverre sikertelen volt!</p>}
                <p className="score-display">Eredményed: <span className="score-value">{result.score}</span> / {result.total}</p>
                {result.total > 0 && <p className="accuracy-display">Pontosság: {((result.score / result.total) * 100).toFixed(0)}%</p>}
                <div className="results-navigation">
                    <button className="result-btn primary" onClick={startNewTestSetup}>Új teszt indítása</button>
                    <button className="result-btn secondary" onClick={goBackToMap}>Vissza a térképre</button>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) {
        return (
            <div className="level-container error-container">
                <h1>Hiba</h1>
                <p className="error-message">Váratlan hiba történt a teszt megjelenítése közben (nincs aktuális kérdés).</p>
                <button className="back-btn" onClick={startNewTestSetup}>Vissza a beállításokhoz</button>
            </div>
        );
    }

    return (
        <div className="level-container test-page">
            <div className="quiz-header">
                <span>{LEVEL_NAME} - Barcelona</span>
                <span>Kérdés: {currentQuestionIndex + 1} / {questions.length}</span>
            </div>
            <motion.div
                key={currentQuestionIndex}
                className="question-card"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
            >
                <p className="question-instruction">Válaszd ki a helyes fordítást:</p>
                <h2 className="question-text">{currentQuestion.question}</h2>
                <div className="options-grid">
                    {currentQuestion.options.map((option, index) => {
                        const optionId = `q${currentQuestionIndex}-opt${index}`;
                        let buttonClass = "option-button";
                        if (showFeedback) {
                            if (option === currentQuestion.correctAnswer) {
                                buttonClass += " correct";
                            } else if (option === selectedOption) {
                                buttonClass += " incorrect";
                            } else {
                                buttonClass += " disabled";
                            }
                        } else if (selectedOption === option) {
                            buttonClass += " selected";
                        }

                        return (
                            <button
                                key={optionId}
                                id={optionId}
                                className={buttonClass}
                                onClick={() => handleOptionSelect(option)}
                                disabled={showFeedback}
                            >
                                {option}
                            </button>
                        );
                    })}
                </div>
                <AnimatePresence>
                    {showFeedback && (
                        <motion.div
                            className={`feedback ${selectedOption === currentQuestion.correctAnswer ? 'feedback-correct' : 'feedback-incorrect'}`}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {selectedOption === currentQuestion.correctAnswer
                                ? "Helyes válasz!"
                                : `Hibás! A helyes válasz: ${currentQuestion.correctAnswer}`
                            }
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
            <div className="quiz-navigation">
                <button
                    className="nav-btn next-btn"
                    onClick={handleNextQuestion}
                    disabled={selectedOption === null || showFeedback}
                >
                    {currentQuestionIndex === questions.length - 1 ? "Teszt Befejezése" : "Következő Kérdés"}
                </button>
            </div>
        </div>
    );
}

export default Level1;