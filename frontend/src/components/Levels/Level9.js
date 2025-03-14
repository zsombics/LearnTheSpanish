import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Levels.css';
import VerbQuiz2 from './quizTypes/VerbQuiz2';

const tenses = [
  { label: "Infinitivo", indices: [6] },
  { label: "Gerundio", indices: [7] },
  { label: "Participio", indices: [8] },
  {
    label: "Indicativo Presente",
    indices: [9, 10, 11, 12, 13, 14],
    persons: ["yo", "tú", "él/ella", "nosotros", "vosotros", "ellos"]
  },
  {
    label: "Indicativo Imperfecto",
    indices: [15, 16, 17, 18, 19, 20],
    persons: ["yo", "tú", "él/ella", "nosotros", "vosotros", "ellos"]
  },
  {
    label: "Indicativo Pretérito",
    indices: [21, 22, 23, 24, 25, 26],
    persons: ["yo", "tú", "él/ella", "nosotros", "vosotros", "ellos"]
  },
  {
    label: "Indicativo Futuro",
    indices: [27, 28, 29, 30, 31, 32],
    persons: ["yo", "tú", "él/ella", "nosotros", "vosotros", "ellos"]
  },
  {
    label: "Condicional",
    indices: [33, 34, 35, 36, 37, 38],
    persons: ["yo", "tú", "él/ella", "nosotros", "vosotros", "ellos"]
  },
  {
    label: "Subjuntivo Presente",
    indices: [39, 40, 41, 42, 43, 44],
    persons: ["yo", "tú", "él/ella", "nosotros", "vosotros", "ellos"]
  },
  {
    label: "Subjuntivo Imperfecto",
    indices: [45, 46, 47, 48, 49, 50],
    persons: ["yo", "tú", "él/ella", "nosotros", "vosotros", "ellos"]
  },
  {
    label: "Imperativo Afirmativo",
    indices: [51, 52, 53, 54, 55],
    persons: ["tú", "usted", "nosotros", "vosotros", "ustedes"]
  },
  {
    label: "Imperativo Negativo",
    indices: [56, 57, 58, 59, 60],
    persons: ["tú", "usted", "nosotros", "vosotros", "ustedes"]
  },
];

const Level9 = () => {
  const navigate = useNavigate();
  const [allRows, setAllRows] = useState([]);
  const [selectedVerbIndex, setSelectedVerbIndex] = useState("random");
  const [selectedTenseIndex, setSelectedTenseIndex] = useState("random");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [numQuestions, setNumQuestions] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [testFinished, setTestFinished] = useState(false);
  const [result, setResult] = useState(null);

  const parseCSV = (text) => {
    return text.split('\n').map(row => row.split(',').map(cell => cell.trim()));
  };

  useEffect(() => {
    fetch('level8/proba.csv')
      .then(response => response.text())
      .then(text => {
        const rows = parseCSV(text);
        if (rows && rows.length > 0) {
          setAllRows(rows);
        }
      })
      .catch(err => console.error('Hiba a CSV beolvasásánál:', err));
  }, []);

  const handleVerbChange = (e) => {
    setSelectedVerbIndex(e.target.value);
  };

  const handleTenseChange = (e) => {
    setSelectedTenseIndex(e.target.value);
  };

  const handleNumQuestionsChange = (e) => {
    setNumQuestions(Number(e.target.value));
  };

  const handleLevelChange = (e) => {
    setSelectedLevel(e.target.value);
  };

  const applySelections = () => {
    const filteredRows = selectedLevel === "all" ? allRows : allRows.filter(row => row[4] === selectedLevel);
    if (filteredRows.length === 0) {
      alert("Nincs olyan ige, mely megfelel a kiválasztott szintnek.");
      return;
    }
    const generatedQuestions = [];
    const shuffledRows = filteredRows.sort(() => Math.random() - 0.5);
    const count = Math.min(numQuestions, shuffledRows.length);
    for (let i = 0; i < count; i++) {
      const verbRow = shuffledRows[i];
      let tense;
      if (selectedTenseIndex === "random") {
        const randomIndex = Math.floor(Math.random() * tenses.length);
        tense = tenses[randomIndex];
      } else {
        tense = tenses[Number(selectedTenseIndex)];
      }
      generatedQuestions.push({ verbRow, tense });
    }
    setQuestions(generatedQuestions);
    const initialAnswers = generatedQuestions.map(q => Array(q.tense.indices.length).fill(''));
    setUserAnswers(initialAnswers);
  };

  const finishTest = () => {
    const effectiveCount = userAnswers.reduce((acc, answers) => acc + answers.length, 0);
    const allCorrectAnswers = questions.map(q =>
      q.tense.indices.map(index => q.verbRow[index] || "")
    );
    let totalScore = 0;
    userAnswers.forEach((ansArray, qIndex) => {
      ansArray.forEach((ans, i) => {
        if (ans.trim() === (allCorrectAnswers[qIndex][i] || "").trim()) {
          totalScore++;
        }
      });
    });
    const levelCalculated =
      totalScore / effectiveCount >= 0.75
        ? "Haladó"
        : totalScore / effectiveCount >= 0.5
        ? "Középhaladó"
        : "Kezdő";
    const payload = {
      answers: userAnswers,
      level: levelCalculated,
      totalQuestions: effectiveCount,
      correctAnswers: totalScore,
      ratio: totalScore / effectiveCount,
      quizCompleted: true,
    };
    axios
      .post('/api/eredmenyk/submit', payload)
      .then(() => {
        setResult({ score: totalScore, total: effectiveCount, level: levelCalculated });
        setTestFinished(true);
      })
      .catch((err) => {
        console.error("Hiba a quiz mentésekor:", err);
        alert("Hiba történt a quiz mentésekor!");
      });
  };

  const restartTest = () => {
    setTestFinished(false);
    setResult(null);
    setQuestions([]);
    setUserAnswers([]);
    setSelectedVerbIndex("random");
    setSelectedTenseIndex("random");
    setSelectedLevel("all");
    setCurrentQuestionIndex(0);
  };

  const goToKviz = () => {
    navigate("/kviz");
  };

  if (questions.length === 0) {
    const filteredRows = selectedLevel === "all" ? allRows : allRows.filter(row => row[4] === selectedLevel);
    return (
      <div className="test-setup">
        <h1>Level 9 – Igeragozás gyakorlat</h1>
        <div className="setup-group">
          <label>Hány kérdés legyen:</label>
          <select value={numQuestions} onChange={handleNumQuestionsChange}>
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
        <div className="setup-group">
          <label>Ige szintje:</label>
          <select value={selectedLevel} onChange={handleLevelChange}>
            <option value="all">Összes</option>
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
        <div className="setup-group">
          <label>Válassz igét:</label>
          <select value={selectedVerbIndex} onChange={handleVerbChange}>
            <option value="random">Random</option>
            {filteredRows.map((row, index) =>
              row[6] && <option key={index} value={index}>{row[6]}</option>
            )}
          </select>
        </div>
        <div className="setup-group">
          <label>Válassz igeidőt:</label>
          <select value={selectedTenseIndex} onChange={handleTenseChange}>
            <option value="random">Random</option>
            {tenses.map((tense, index) => (
              <option key={index} value={index}>
                {tense.label}
              </option>
            ))}
          </select>
        </div>
        <button className="start-test-btn" onClick={applySelections}>
          Alkalmaz
        </button>
      </div>
    );
  }

  if (testFinished && result) {
    return (
      <div className="test-results">
        <h1>Eredmény</h1>
        <p>
          {result.score} helyes válasz a {result.total} kérdésből.
        </p>
        <p>Szint: {result.level}</p>
        <div className="results-navigation">
          <button className="result-btn" onClick={restartTest}>
            Új teszt
          </button>
          <button className="result-btn secondary" onClick={goToKviz}>
            Vissza a Kvízhez
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishTest();
    }
  };

  return (
    <div className="level9-container">
      <VerbQuiz2
        activeVerbRow={currentQuestion.verbRow}
        activeTense={currentQuestion.tense}
        userAnswers={userAnswers[currentQuestionIndex]}
        setUserAnswers={(answers) => {
          const newUserAnswers = [...userAnswers];
          newUserAnswers[currentQuestionIndex] = answers;
          setUserAnswers(newUserAnswers);
        }}
        finishTest={finishTest}
      />
      <div className="quiz-navigation">
        {currentQuestionIndex < questions.length - 1 ? (
          <button className="nav-btn" onClick={handleNextQuestion}>
            Következő
          </button>
        ) : (
          <button className="nav-btn" onClick={handleNextQuestion}>
            Befejezés
          </button>
        )}
      </div>
    </div>
  );
};

export default Level9;
