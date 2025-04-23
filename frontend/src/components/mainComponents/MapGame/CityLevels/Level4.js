import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Levels.css';
import DemoContent2 from '../../../Levels/demos/DemoContent2';
import FillInTheBlankQuiz from '../../../Levels/quizTypes/FillTheBlankV2'

function parseCSV(data) {
    const lines = data.trim().split("\n");
    return lines.filter(line => line.trim() !== '').map(line => {
        const parts = line.split(";").map(item => item.trim());
        if (parts.length >= 3) {
            const [spanish, english, hungarian] = parts;
            return { spanish, english, hungarian };
        }
        console.warn("Skipping invalid CSV line (expected 3 parts separated by ';'):", line);
        return null;
    }).filter(item => item !== null);
}

const CITY_ID = 4;
const LEVEL_NAME = 'Level4';

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
    const [userAnswers, setUserAnswers] = useState({});
    const [testFinished, setTestFinished] = useState(false);
    const [result, setResult] = useState(null);
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        if (testStarted && allItems.length === 0) {
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
                default:
                    console.error("Unknown test type selected:", testType);
                    alert("Ismeretlen teszt típus!");
                    setTestStarted(false);
                    return;
            }

            fetch(fileToFetch)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status} fetching ${fileToFetch}`);
                    }
                    return response.text();
                })
                .then(text => {
                    let items = parseCSV(text);
                    if (items && items.length > 0) {
                        setAllItems(items);
                        generateQuestions(items);
                        setShowDemo(true);
                    } else {
                        console.error(`No valid items parsed from ${fileToFetch}.`);
                        alert(`Hiba: Nem sikerült érvényes elemeket beolvasni a ${fileToFetch} fájlból.`);
                        restartTest();
                    }
                })
                .catch(err => {
                    console.error("CSV loading or parsing error:", err);
                    alert(`Hiba történt a ${fileToFetch} betöltése vagy feldolgozása közben.`);
                    restartTest();
                });
        }
    }, [testStarted, testType, allItems.length]);

    const generateQuestions = (items) => {
        if (!items || items.length === 0) {
            console.error("Cannot generate questions: items array is empty.");
            return;
        }
        const selectedQuestions = items.map(item => {
            if (!item || !item.spanish || !item.english || !item.hungarian) {
                console.warn("Skipping question generation for invalid item:", item);
                return null;
            }
            return {
                question: `Írd be a spanyol megfelelőt: "${item.hungarian}" / "${item.english}"`,
                correctAnswer: item.spanish,
                hungarian: item.hungarian,
                english: item.english
            };
        }).filter(q => q !== null);

        if (selectedQuestions.length === 0) {
            console.error("Failed to generate any valid questions from the items.");
            alert("Hiba: Nem sikerült érvényes kérdéseket generálni.");
            restartTest();
            return;
        }

        const shuffledQuestions = selectedQuestions.sort(() => Math.random() - 0.5);
        setQuestions(shuffledQuestions);
        setCurrentQuestionIndex(0);
        setTypedAnswer("");
        setShowFeedback(false);
        setUserAnswers({});
        setTestFinished(false);
        setResult(null);
        setIsChecked(false);
    };

    const startTest = () => {
        setAllItems([]);
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setTypedAnswer("");
        setShowFeedback(false);
        setUserAnswers({});
        setTestFinished(false);
        setResult(null);
        setShowDemo(false);
        setIsChecked(false);
        setTestStarted(true);
    };

    const startQuiz = () => {
        if (questions.length > 0) {
            setShowDemo(false);
        } else {
            console.log("Waiting for questions to load...");
        }
    };

    const goToKviz = () => {
        navigate("/kviz");
    };

    const handleAnswerChange = (e) => {
         if (!isChecked) {
            setTypedAnswer(e.target.value);
         }
    };

    const handleCheckAnswer = () => {
        const currentAnswer = typedAnswer.trim();
        if (!currentAnswer) {
            alert("Kérlek, írd be a választ!");
            return;
        }

        const updatedAnswers = {
            ...userAnswers,
            [currentQuestionIndex]: currentAnswer
        };
        setUserAnswers(updatedAnswers);
        setShowFeedback(true);
        setIsChecked(true);
    };

    const handleNextOrFinish = () => {
        if (!isChecked) {
            alert("Kérlek, előbb ellenőrizd a válaszodat!");
            return;
        }

        const finalUserAnswers = { ...userAnswers };
        setShowFeedback(false);
        setTypedAnswer("");
        setIsChecked(false);

        if (currentQuestionIndex === questions.length - 1) {
            finishTest(finalUserAnswers);
        } else {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const finishTest = (finalUserAnswers) => {
        if (!questions || questions.length === 0) {
            console.error("Cannot finish test: Questions data is missing.");
            alert("Hiba történt a teszt befejezésekor (hiányzó kérdések).");
            return;
        }

        let finalScore = 0;
        questions.forEach((question, index) => {
            const userAnswer = finalUserAnswers[index];
            const correctAnswer = question.correctAnswer;
            if (userAnswer && typeof userAnswer === 'string' && typeof correctAnswer === 'string' && userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
                finalScore++;
            }
        });

        const ratio = questions.length > 0 ? finalScore / questions.length : 0;


        const payload = {
            answers: finalUserAnswers,
            level: LEVEL_NAME,
            cityId: CITY_ID,
            totalQuestions: questions.length,
            correctAnswers: finalScore,
            ratio: ratio,
            quizCompleted: true,
            testType: testType,
        };

        console.log("Submitting results:", payload);

        axios.post('/api/eredmenyek/submit', payload)
            .then(response => {
                console.log("Quiz results submitted successfully:", response.data);
                setResult({ score: finalScore, total: questions.length, level: LEVEL_NAME });
                setTestFinished(true);
            })
            .catch(err => {
                console.error("Hiba a quiz mentésekor:", err.response ? err.response.data : err.message);
                alert(`Hiba történt a quiz eredményeinek mentésekor: ${err.response ? err.response.data.message || err.message : err.message}. Az eredményeid helyben megjelennek.`);
                setResult({ score: finalScore, total: questions.length, level: LEVEL_NAME });
                setTestFinished(true);
            });
    };

    const restartTest = () => {
        setTestStarted(false);
        setAllItems([]);
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setTypedAnswer("");
        setShowFeedback(false);
        setUserAnswers({});
        setTestFinished(false);
        setResult(null);
        setShowDemo(false);
        setIsChecked(false);
    };

    if (!testStarted) {
        return (
            <div className="test-setup">
                <h1>Spanyolországba készülök</h1>
                <h2>Legfontosabb mondatok egy turistának</h2>
                <div className="setup-group">
                    <label htmlFor="level4-test-type">Teszt típusa:</label>
                    <select id="level4-test-type" value={testType} onChange={(e) => setTestType(e.target.value)}>
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

    if (allItems.length === 0 && testStarted) {
        return <div className="test-page">Adatok betöltése...</div>;
    }

    if (showDemo) {
        return (
            <DemoContent2 testType={testType} startQuiz={startQuiz} items={allItems} restartTest={restartTest} />
        );
    }

    if (questions.length === 0 && testStarted) {
        return <div className="test-page">Kérdések generálása...</div>;
    }

    if (testFinished && result) {
        return (
            <div className="test-results">
                <h1>Eredmény</h1>
                <p>{result.score} helyes válasz a {result.total} kérdésből.</p>
                <p>Szint: {result.level}</p>
                <p>Pontosság: {result.total > 0 ? Math.round((result.score / result.total) * 100) : 0}%</p>
                <div className="results-navigation">
                    <button className="result-btn" onClick={restartTest}>Új teszt</button>
                    <button className="result-btn secondary" onClick={goToKviz}>Vissza a Kvízhez</button>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) {
        console.error(`Error: Question at index ${currentQuestionIndex} is undefined. Questions array length: ${questions.length}`);
        return <div className="test-page error">Hiba történt a kérdés betöltésekor. <button onClick={restartTest}>Újrapróbálkozás</button></div>;
    }

    return (
        <div className="test-page">
            <div className="progress-indicator">
                Kérdés: {currentQuestionIndex + 1} / {questions.length}
            </div>
            <FillInTheBlankQuiz
                currentQuestion={currentQuestion}
                typedAnswer={typedAnswer}
                handleAnswerChange={handleAnswerChange}
                showFeedback={showFeedback}
                userAnswer={userAnswers[currentQuestionIndex]}
                disabled={isChecked}
            />
            <div className="quiz-navigation2">
                <button
                    className="nav-btn2 check-btn2"
                    onClick={handleCheckAnswer}
                    disabled={isChecked || !typedAnswer.trim()}
                >
                    Ellenőrzés
                </button>
                <button
                    className={`nav-btn2 ${currentQuestionIndex === questions.length - 1 ? 'finish-btn2' : ''}`}
                    onClick={handleNextOrFinish}
                    disabled={!isChecked}
                >
                    {currentQuestionIndex < questions.length - 1 ? 'Következő' : 'Befejezés'}
                </button>
            </div>
        </div>
    );
}

export default Level4;
