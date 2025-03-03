import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'D:/LearnTheSpanish/frontend/src/styles/Levels.css';
import DemoContent2 from './DemoContent2';
import FillInTheBlankQuiz from './quizTypes/FillTheBlankV2';

function parseCSV(data) {
    const lines = data.trim().split("\n");
    return lines.map(line => {
        const [spanish, english, hungarian] = line.split(";").map(item => item.trim());
        return { spanish, english, hungarian };
    });
}

function Level4() {
    const navigate = useNavigate();
    const [testType, setTestType] = useState("udvariassag");
    const [showDemo, setShowDemo] = useState(false);
    const [testStarted, setTestStarted] = useState(false);
    const [allItems, setAllItems] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [typedAnswer, setTypedAnswer] = useState("");
    const [showFeedback, setShowFeedback] = useState(false);
    const [score, setScore] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [testFinished, setTestFinished] = useState(false);
    const [result, setResult] = useState(null);

    useEffect(() => {
        if (testStarted) {
            let fileToFetch;
            switch (testType) {
                case "udvariassag":
                    fileToFetch = '/courtesy.csv';
                    break;
                case "kommunikacio":
                    fileToFetch = '/communication.csv';
                    break;
                case "etkezes":
                    fileToFetch = '/food_shopping.csv';
                    break;
                case "kozlekedes":
                    fileToFetch = '/transport_location.csv';
                    break;
                case "szallas":
                    fileToFetch = '/accommodation_health.csv';
                    break;
            }

            fetch(fileToFetch)
                .then(response => response.text())
                .then(text => {
                    let items = parseCSV(text);
                    setAllItems(items);
                    generateQuestions(items);
                })
                .catch(err => console.error("CSV loading error:", err));
        }
    }, [testStarted, testType]);

    const generateQuestions = (items) => {
        const selectedQuestions = items.map(item => ({
            question: `Írd be a spanyol megfelelőt a következő kifejezésnek: ${item.hungarian} / ${item.english}`,
            correctAnswer: item.spanish
        }));
        // Shuffle the questions
        const shuffledQuestions = selectedQuestions.sort(() => Math.random() - 0.5);
        setQuestions(shuffledQuestions);
    };

    const startTest = () => {
        setTestStarted(true);
        setShowDemo(true);
    };

    const startQuiz = () => {
        setShowDemo(false);
    };

    const goToKviz = () => {
        window.open("/kviz", "_self");
    };

    const handleAnswerChange = (e) => {
        setTypedAnswer(e.target.value);
    };

    const handleCheckAnswer = () => {
        const userResponse = typedAnswer.trim();
        if (!userResponse) {
            alert("Kérlek, írd be a választ!");
            return;
        }
        setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: userResponse }));
        const isCorrect = userResponse === questions[currentQuestionIndex].correctAnswer;
        if (isCorrect) {
            setScore(prev => prev + 1);
        }
        setShowFeedback(true);
    };

    const handleNextQuestion = () => {
        setShowFeedback(false);
        const userResponse = typedAnswer.trim();
        if (!userResponse) {
            alert("Kérlek, írd be a választ!");
            return;
        }
        setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: userResponse }));
        const isCorrect = userResponse === questions[currentQuestionIndex].correctAnswer;
        if (isCorrect) {
            setScore(prev => prev + 1);
        }
        setTypedAnswer("");
        if (currentQuestionIndex === questions.length - 1) {
            finishTest();
        } else {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const finishTest = () => {
        const levelCalculated = score / questions.length >= 0.75 ? "Haladó"
            : score / questions.length >= 0.5 ? "Középhaladó" : "Kezdő";
        const payload = {
            answers: userAnswers,
            level: levelCalculated,
            totalQuestions: questions.length,
            correctAnswers: score,
            ratio: score / questions.length,
            quizCompleted: true
        };
        axios.post('/api/eredmenyek/submit', payload)
            .then(() => {
                setResult({ score, total: questions.length, level: levelCalculated });
                setTestFinished(true);
            })
            .catch(err => {
                console.error("Hiba a quiz mentésekor:", err);
                alert("Hiba történt a quiz mentésekor!");
            });
    };    

    const restartTest = () => {
        setTestStarted(false);
        setAllItems([]);
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setTypedAnswer("");
        setShowFeedback(false);
        setScore(0);
        setUserAnswers({});
        setTestFinished(false);
        setResult(null);
    };

    if (!testStarted) {
        return (
            <div className="test-setup">
                <h1>Spanyolországba készülök</h1>
                <h2>Legfontosabb mondatok egy turistának</h2>
                <div className="setup-group">
                    <label>Teszt típusa:</label>
                    <select value={testType} onChange={(e) => setTestType(e.target.value)}>
                        <option value="udvariassag">Udvariassági kifejezések</option>
                        <option value="kommunikacio">Kommunikáció és segítségkérés</option>
                        <option value="etkezes">Étkezés és vásárlás</option>
                        <option value="kozlekedes">Közlekedés és helymeghatározás</option>
                        <option value="szallas">Szállás és egészségügy</option>
                    </select>
                </div>
                <button className="start-test-btn" onClick={startTest}>
                    Teszt indítása
                </button>
            </div>
        );
    }

    if (showDemo) {
        return (
            <DemoContent2 testType={testType} startQuiz={startQuiz} items={allItems} />
        );
    }

    if (testFinished && result) {
        return (
            <div className="test-results">
                <h1>Eredmény</h1>
                <p>{result.score} helyes válasz a {result.total} kérdésből.</p>
                <p>Szint: {result.level}</p>
                <div className="results-navigation">
                    <button className="result-btn" onClick={restartTest}>Új teszt</button>
                    <button className="result-btn secondary" onClick={goToKviz}>Vissza a Kvízhez</button>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="test-page">
            <FillInTheBlankQuiz
                currentQuestion={currentQuestion}
                typedAnswer={typedAnswer}
                handleAnswerChange={handleAnswerChange}
                showFeedback={showFeedback}
            />
            <div className="quiz-navigation2">
                <button className="nav-btn2 check-btn2" onClick={handleCheckAnswer}>Ellenőrzés</button>
                {currentQuestionIndex < questions.length - 1 && (
                    <button className="nav-btn2" onClick={handleNextQuestion}>Következő</button>
                )}
                {currentQuestionIndex === questions.length - 1 && (
                    <button className="nav-btn2 finish-btn2" onClick={handleNextQuestion}>Befejezés</button>
                )}
            </div>
        </div>
    );
}

export default Level4;
