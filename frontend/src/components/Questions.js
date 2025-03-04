import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Questions.css';
import '../styles/boxed-check.min.css';

const questions = [
  {
    id: 1,
    question: "Mennyi ideje tanulsz spanyolul?",
    options: [
      "Még nem tanultam",
      "1-6 hónap",
      "6 hónaptól 1 évig",
      "1 év felett"
    ]
  },
  {
    id: 2,
    question: "Milyen gyakran használod a spanyol nyelvet a mindennapokban?",
    options: [
      "Soha",
      "Alkalomadtán",
      "Rendszeresen",
      "Napi szinten"
    ]
  },
  {
    id: 3,
    question: "Hogyan értékelnéd a spanyol nyelvtudásodat?",
    options: [
      "Kezdő",
      "Középhaladó",
      "Haladó",
      "Anyanyelvi"
    ]
  },
  {
    id: 4,
    question: "Milyen típusú szövegeket tudsz könnyen megérteni spanyolul?",
    options: [
      "Egyszerű mondatok",
      "Rövid cikkek",
      "Hosszú könyvek",
      "Speciális szakmai szövegek"
    ]
  },
  {
    id: 5,
    question: "Hogyan érzed magad spanyol nyelvű kommunikáció közben?",
    options: [
      "Bizonytalanul",
      "Elfogadhatóan",
      "Magabiztosan",
      "Kiválóan"
    ]
  }
];

function QuizQuestions() {
  const [started, setStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  // Indítás: a hero gomb megnyomásával a kérdőív elkezdődik
  const handleStart = () => {
    setStarted(true);
  };

  // Válasz rögzítése
  const handleOptionChange = (questionId, option) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  // Következő gomb: ellenőrzi, hogy a jelenlegi kérdésre választ adott-e, majd lép a következőre
  const handleNext = () => {
    const currentQId = questions[currentQuestionIndex].id;
    if (!answers[currentQId]) {
      alert("Kérlek, válassz egy lehetőséget!");
      return;
    }
    setCurrentQuestionIndex(prevIndex => prevIndex + 1);
  };

  // Befejezés gomb: az utolsó kérdés után összegyűjti a válaszokat,
  // dummy logika alapján meghatározza a szintet, majd elküldi az adatokat az API-nak.
  // Sikeres mentés után átirányítja a felhasználót a /kviz végpontra.
  const handleFinish = () => {
    const currentQId = questions[currentQuestionIndex].id;
    if (!answers[currentQId]) {
      alert("Kérlek, válassz egy lehetőséget az utolsó kérdéshez!");
      return;
    }

    // Dummy szint meghatározás – később implementáld a logikát!
    const level = "Középhaladó";

    const payload = {
      answers: answers,
      level: level,
      quizCompleted: true
    };

    axios.post('/api/quiz/submit', payload)
      .then(res => {
        alert("A quiz eredménye sikeresen elmentve!");
        window.open("/kviz", "_self"); // Opens /kviz in the same tab
      })
      .catch(err => {
        console.error("Hiba a quiz mentésekor:", err);
        alert("Hiba történt a quiz mentésekor!");
      });
  };

  return (
    <div className="quiz-page">
      {/* Hero Section: csak akkor jelenik meg, ha a 'started' false */}
      {!started && (
        <section className="hero-section">
          <div className="hero-container">
            <h1 className="hero-title">Spanyol Nyelv Szintfelmérő</h1>
            <button className="hero-button" onClick={handleStart}>
              Kezd el a kérdőívet
            </button>
          </div>
        </section>
      )}

      {/* Questions Section: ha a kérdőív elkezdődött */}
      {started && (
        <section className="hero-section">
          <div className="questions-container">
            <div className="question-card">
              <h2 className="question-text">
                {questions[currentQuestionIndex].question}
              </h2>

              {/* Boxed-Check Styled Radio Buttons */}
              <div className="boxed-check-group boxed-check-outline-primary">
                {questions[currentQuestionIndex].options.map((option, index) => (
                  <label key={index} className="boxed-check">
                    <input
                      className="boxed-check-input"
                      type="radio"
                      name={`question-${questions[currentQuestionIndex].id}`}
                      value={option}
                      checked={answers[questions[currentQuestionIndex].id] === option}
                      onChange={() => handleOptionChange(questions[currentQuestionIndex].id, option)}
                    />
                    <div className="boxed-check-label">{option}</div>
                  </label>
                ))}
              </div>
            </div>
            <div className="quiz-navigation">
              {currentQuestionIndex < questions.length - 1 ? (
                <button className="hero-button2" onClick={handleNext}>
                  Következő
                </button>
              ) : (
                <button className="hero-button2" onClick={handleFinish}>
                  Befejezés
                </button>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default QuizQuestions;
