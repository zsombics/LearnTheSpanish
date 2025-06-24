import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/Levels.css';
import DemoContent2 from './demos/DemoContent2';
import FillInTheBlankV2 from './quizTypes/FillTheBlankV2';
import DemoContent3 from './demos/DemoContent3';

function Level7() {
    const [testStarted, setTestStarted] = useState(false);
    const [direction, setDirection] = useState('hatarozo-nevelok');
    const [questions, setQuestions] = useState([]);
    const [testFinished, setTestFinished] = useState(false);
    const [result, setResult] = useState(null);
    const [dynamicOptions, setDynamicOptions] = useState([]);
    const [showDemo, setShowDemo] = useState(true);
    const [showDemo3, setShowDemo3] = useState(true);
    const [typedAnswer, setTypedAnswer] = useState("");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showFeedback, setShowFeedback] = useState(false);
    const [userAnswers, setUserAnswers] = useState({});

    const goToKviz = () => window.open("/kviz", "_self");
    const startTest = () => {
        setTestStarted(true);
        setShowDemo(true);
        setShowDemo3(true);
    };
    const restartTest = () => {
        setTestStarted(false);
        setTestFinished(false);
        setResult(null);
        setShowDemo(true);
        setShowDemo3(true);
        setTypedAnswer("");
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowFeedback(false);
        setUserAnswers({});
    };

    useEffect(() => {
        if (testStarted) {
            let demoFileToFetch, quizFileToFetch;

            if (direction === "yo-tengo-yo-quiero") {
                demoFileToFetch = '/level7/yo-tengo-yo-quiero1.csv';
                quizFileToFetch = '/level7/yo-tengo-yo-quiero2.csv';
            } else {
                switch (direction) {
                    case "hatarozo-nevelok":
                        demoFileToFetch = quizFileToFetch = '/level7/hatarozo-nevelok.csv';
                        break;
                    case "hatarozatlan-nevelok":
                        demoFileToFetch = quizFileToFetch = '/level7/hatarozatlan-nevelok.csv';
                        break;
                    case "a-hay-hasznalata":
                        demoFileToFetch = '/level7/a-hay-hasznalata1.csv';
                        quizFileToFetch = '/level7/a-hay-hasznalata2.csv';
                        break;
                    case "alanyi-nevmasok":
                        demoFileToFetch = '/level7/alanyi-nevmasok1.csv';
                        quizFileToFetch = '/level7/alanyi-nevmasok2.csv';
                        break;
                    case "osszegzo-1":
                        demoFileToFetch = quizFileToFetch = '/level7/osszegzo-1.csv';
                        break;
                    default:
                        demoFileToFetch = quizFileToFetch = '/level7/hatarozo-neveloknem.csv';
                }
            }

            fetch(demoFileToFetch)
                .then(response => response.text())
                .then(text => {
                    const parsedOptions = parseMatchingAdjectivesCSV(text);
                    setDynamicOptions(parsedOptions);
                })
                .catch(err => console.error("CSV loading error (demo):", err));

            // Fetch the quiz file for FillInTheBlankV2 (questions)
            fetch(quizFileToFetch)
                .then(response => response.text())
                .then(text => {
                    const parsedOptions = parseMatchingAdjectivesCSV(text);
                    const shuffledQuestions = parsedOptions
                        .map(item => ({
                            question: `Írja be a megfelelő választ: ${item.english} / ${item.hungarian}`,
                            correctAnswer: item.spanish
                        }))
                        .sort(() => Math.random() - 0.5);
                    setQuestions(shuffledQuestions);
                })
                .catch(err => console.error("CSV loading error (quiz):", err));
        }
    }, [testStarted, direction]);


    function parseMatchingAdjectivesCSV(data) {
        const lines = data.trim().split("\n");
        return lines.map(line => {
            const [spanish, english, hungarian] = line.split(";").map(item => item.trim());
            return { spanish, english, hungarian };
        });
    }

    const handleAnswerChange = (e) => {
        setTypedAnswer(e.target.value);
    };

    const handleNextQuestion = () => {
        const userResponse = typedAnswer.trim();
        if (userResponse === "") {
            alert("Kérlek, add meg a válaszodat!");
            return;
        }
        const isCorrect = userResponse === questions[currentQuestionIndex].correctAnswer;
        if (isCorrect) {
            setScore(prev => prev + 1);
        }
        setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: userResponse }));
        setShowFeedback(true);
        setTimeout(() => {
            setShowFeedback(false);
            setTypedAnswer("");
            if (currentQuestionIndex === questions.length - 1) {
                finishTest();
            } else {
                setCurrentQuestionIndex(prev => prev + 1);
            }
        }, 3000);
    };

    const finishTest = () => {
        setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: typedAnswer.trim() }));

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

    const startQuiz = () => {
        setShowDemo(false);
    };

    const startQuiz2 = () => {
        setShowDemo3(false)
    };

    if (!testStarted) {
        return (
            <div className="test-setup">
                <h1>Válaszd ki a teszt paramétereit</h1>
                <div className="setup-group">
                    <label>Teszt iránya:</label>
                    <select value={direction} onChange={(e) => setDirection(e.target.value)}>
                        <option value="hatarozo-nevelok">Határozó névelők · Család</option>
                        <option value="hatarozatlan-nevelok">Határozatlan névelők · A ház körül</option>
                        <option value="yo-tengo-yo-quiero">Yo tengo és yo quiero · Állatok</option>
                        <option value="a-hay-hasznalata">A "hay" használata · Az osztályterem</option>
                        <option value="alanyi-nevmasok">Alanyi névmások · Gyakori -ar igék · Szabályos -ar igék</option>
                    </select>
                </div>
                <button className="start-test-btn" onClick={startTest}>Teszt indítása</button>
            </div>
        );
    }

    if (questions.length === 0) return <div>Betöltés...</div>;

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

    if (showDemo && showDemo3) {
        return (
            <div>
                <DemoContent3 testType={direction} startQuiz2={startQuiz2} />
            </div>
        );
    }

    if (showDemo && !showDemo3) {
        return (
            <DemoContent2 testType="fill-in-the-blank" startQuiz={startQuiz} items={dynamicOptions} />
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    if (!currentQuestion) {
        return <div>Loading question...</div>;
    }

    return (
        <div className="test-page">
            <FillInTheBlankV2
                currentQuestion={currentQuestion}
                typedAnswer={typedAnswer}
                handleAnswerChange={handleAnswerChange}
                showFeedback={showFeedback}
            />
            <div className="quiz-navigation">
                {currentQuestionIndex < questions.length - 1 ? (
                    <button className="nav-btn" onClick={handleNextQuestion}>Következő</button>
                ) : (
                    <button className="nav-btn" onClick={finishTest}>Befejezés</button>
                )}
            </div>
        </div>
    );
}
export default Level7;
