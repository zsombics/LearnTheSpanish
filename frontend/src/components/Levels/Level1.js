import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/Levels.css';

export function parseCSV(data) {
    if (!data.trim()) {
      return [];
    }
    const lines = data.trim().split("\n");
    return lines.map(line => {
      const [english, spanish, hungarian] = line.split(",").map(item => item.trim());
      return { english, spanish, hungarian };
    });
  }  

function Level1() {
    const navigate = useNavigate();
    const [numQuestions, setNumQuestions] = useState(5);
    const [direction, setDirection] = useState("spanyol-magyar");
    const [testStarted, setTestStarted] = useState(false);
    const [allWords, setAllWords] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [score, setScore] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [testFinished, setTestFinished] = useState(false);
    const [result, setResult] = useState(null);

    useEffect(() => {
        if (testStarted) {
            axios.get('/api/words')
                .then(response => {
                    const words = response.data;
                    setAllWords(words);
                    generateQuestions(words);
                })
                .catch(err => console.error("Adatbázis betöltési hiba:", err));
        }
    }, [testStarted]);

    const generateQuestions = (words) => {
        const selectedQuestions = [];
        for (let i = 0; i < numQuestions; i++) {
            const randomIndex = Math.floor(Math.random() * words.length);
            const word = words[randomIndex];
            const questionText = direction === "spanyol-magyar" ? word.spanish : word.hungarian;
            const correctAnswer = direction === "spanyol-magyar" ? word.hungarian : word.spanish;
            const options = [correctAnswer];
            while (options.length < 4) {
                const randIdx = Math.floor(Math.random() * words.length);
                const candidate = direction === "spanyol-magyar" ? words[randIdx].hungarian : words[randIdx].spanish;
                if (!options.includes(candidate)) options.push(candidate);
            }
            options.sort(() => Math.random() - 0.5);
            selectedQuestions.push({ question: questionText, correctAnswer, options });
        }
        setQuestions(selectedQuestions);
    };

    const startTest = () => setTestStarted(true);

    const handleOptionSelect = (option) => setSelectedOption(option);

    const handleNextQuestion = () => {
        if (selectedOption === null) {
            alert("Kérlek, válassz egy lehetőséget!");
            return;
        }

        setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: selectedOption }));
        if (selectedOption === questions[currentQuestionIndex].correctAnswer) {
            setScore(prev => prev + 1);
        }
        setShowFeedback(true);

        setTimeout(() => {
            setShowFeedback(false);
            setSelectedOption(null);
            if (currentQuestionIndex === questions.length - 1) {
                finishTest();
            } else {
                setCurrentQuestionIndex(prev => prev + 1);
            }
        }, 3000);
    };

    const finishTest = () => {
        const levelCalculated = score / questions.length >= 0.75 ? "Haladó"
            : score / questions.length >= 0.5 ? "Középhaladó"
                : "Kezdő";
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
        setAllWords([]);
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setShowFeedback(false);
        setScore(0);
        setUserAnswers({});
        setTestFinished(false);
        setResult(null);
    };

    const goToKviz = () => window.open("/kviz", "_self");

    if (!testStarted) {
        return (
            <div className="test-setup">
                <h1>Válaszd ki a teszt paramétereit</h1>
                <div className="setup-group">
                    <label>Hány kérdés legyen a tesztben?</label>
                    <select value={numQuestions} onChange={(e) => setNumQuestions(Number(e.target.value))}>
                        {[5, 10, 15, 20, 25, 50, 100].map(num => <option key={num} value={num}>{num}</option>)}
                    </select>
                </div>
                <div className="setup-group">
                    <label>Teszt iránya:</label>
                    <select value={direction} onChange={(e) => setDirection(e.target.value)}>
                        <option value="spanyol-magyar">Spanyol → Magyar</option>
                        <option value="magyar-spanyol">Magyar → Spanyol</option>
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

    const currentQuestion = questions[currentQuestionIndex];
    return (
        <div className="test-page">
            <div className="question-card">
                <h2 className="question-text">{currentQuestion.question}</h2>
                <div className="options">
                    {currentQuestion.options.map((option, index) => {
                        const optionId = `question-${currentQuestionIndex}-option-${index}`;
                        let labelClass = "btn";
                        if (showFeedback) {
                            if (option === currentQuestion.correctAnswer) labelClass += " btn-success";
                            else if (option === selectedOption) labelClass += " btn-danger";
                            else labelClass += " btn-outline-secondary";
                        } else labelClass += selectedOption === option ? " btn-outline-success" : " btn-outline-primary";
                        return (
                            <div key={index} className="option-item">
                                <input type="radio" className="btn-check" id={optionId} name={`question-${currentQuestionIndex}`} value={option} checked={selectedOption === option} onChange={() => handleOptionSelect(option)} autoComplete="off" />
                                <label className={labelClass} htmlFor={optionId}>{option}</label>
                            </div>
                        );
                    })}
                </div>
                {showFeedback && (
                    <div className="feedback">
                        {selectedOption === currentQuestion.correctAnswer ? <p className="correct-feedback">Helyes válasz!</p> : <p className="incorrect-feedback">Hibás válasz! A helyes válasz: <span className="correct-answer">{currentQuestion.correctAnswer}</span></p>}
                    </div>
                )}
            </div>
            <div className="quiz-navigation">
                <button className="nav-btn" onClick={handleNextQuestion}>
                    {currentQuestionIndex === questions.length - 1 ? "Befejezés" : "Következő"}
                </button>
            </div>
        </div>
    );
}

export default Level1;