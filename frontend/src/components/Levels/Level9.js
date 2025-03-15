import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Levels.css';
import VerbQuiz2 from './quizTypes/VerbQuiz2';

const tenses = [
  { label: "Level", indices: [5] },
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
  {
    label: "Indicativo Pretérito Perfecto",
    indices: [61, 62, 63, 64, 65, 66],
    persons: ["yo", "tú", "él/ella", "nosotros", "vosotros", "ellos"]
  },
  {
    label: "Indicativo Pluscuamperfecto",
    indices: [67, 68, 69, 70, 71, 72],
    persons: ["yo", "tú", "él/ella", "nosotros", "vosotros", "ellos"]
  },
  {
    label: "Indicativo Pretérito Anterior",
    indices: [73, 74, 75, 76, 77, 78],
    persons: ["yo", "tú", "él/ella", "nosotros", "vosotros", "ellos"]
  },
  {
    label: "Indicativo Futuro Perfecto",
    indices: [79, 80, 81, 82, 83, 84],
    persons: ["yo", "tú", "él/ella", "nosotros", "vosotros", "ellos"]
  },
  {
    label: "Condicional Perfecto",
    indices: [85, 86, 87, 88, 89, 90],
    persons: ["yo", "tú", "él/ella", "nosotros", "vosotros", "ellos"]
  },
  {
    label: "Subjuntivo Pretérito Perfecto",
    indices: [91, 92, 93, 94, 95, 96],
    persons: ["yo", "tú", "él/ella", "nosotros", "vosotros", "ellos"]
  },
  {
    label: "Subjuntivo Pluscuamperfecto",
    indices: [97, 98, 99, 100, 101, 102],
    persons: ["yo", "tú", "él/ella", "nosotros", "vosotros", "ellos"]
  }
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
    if (e.target.value !== "random") {
      setSelectedLevel("all");
    }
  };

  const handleTenseChange = (e) => {
    setSelectedTenseIndex(e.target.value);
  };

  const handleNumQuestionsChange = (e) => {
    setNumQuestions(Number(e.target.value));
  };

  const handleLevelChange = (e) => {
    setSelectedLevel(e.target.value);
    if (e.target.value !== "all") {
      setSelectedVerbIndex("random");
    }
  };

  const applySelections = () => {
    let filteredRows = [];
    if (selectedVerbIndex !== "random") {
      const verbRow = allRows[selectedVerbIndex];
      if (!verbRow) {
        alert("A kiválasztott ige nem található.");
        return;
      }
      filteredRows = [verbRow];
    } else {
      filteredRows =
        selectedLevel === "all"
          ? allRows
          : allRows.filter((row) => Number(row[5]) <= Number(selectedLevel));
    }

    if (filteredRows.length === 0) {
      alert("Nincs megfelelő ige a kiválasztott szinten.");
      return;
    }

    const excludedTenses = ["Infinitivo", "Gerundio", "Participio", "Level"];
    let allowedTenses = tenses.filter(
      (tense) => !excludedTenses.includes(tense.label)
    );

    if (selectedTenseIndex !== "random") {
      allowedTenses = [tenses[selectedTenseIndex]];
    }

    const generatedQuestions = [];
    for (let i = 0; i < numQuestions; i++) {
      let verbRow;
      if (selectedVerbIndex !== "random") {
        verbRow = filteredRows[0];
      } else {
        verbRow = filteredRows[Math.floor(Math.random() * filteredRows.length)];
      }
      const randomTense = allowedTenses[Math.floor(Math.random() * allowedTenses.length)];
      generatedQuestions.push({ verbRow, tense: randomTense });
    }

    setQuestions(generatedQuestions);
    setUserAnswers(Array(numQuestions).fill([]));
    setCurrentQuestionIndex(0);
  };

  const finishTest = () => {
    const completeAnswers = userAnswers.map(answers => answers.map(ans => ans || ""));
    const correctAnswers = questions.map(q =>
      q.tense.indices.map(index => q.verbRow[index] || "")
    );
    let totalScore = 0;
    completeAnswers.forEach((ansArray, qIndex) => {
      ansArray.forEach((ans, i) => {
        if (ans.trim() === (correctAnswers[qIndex][i] || "").trim()) {
          totalScore++;
        }
      });
    });
    const effectiveCount = completeAnswers.flat().length;
    const levelCalculated =
      totalScore / effectiveCount >= 0.75
        ? "Haladó"
        : totalScore / effectiveCount >= 0.5
          ? "Középhaladó"
          : "Kezdő";
    const payload = {
      answers: completeAnswers,
      level: levelCalculated,
      totalQuestions: effectiveCount,
      correctAnswers: totalScore,
      ratio: totalScore / effectiveCount,
      quizCompleted: true,
    };
    axios
      .post('/api/eredmenyek/submit', payload)
      .then(() => {
        setResult({ score: totalScore, total: effectiveCount, level: levelCalculated });
        setTestFinished(true);
      })
      .catch(err => {
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
    setNumQuestions(5);
  };

  const goToKviz = () => {
    window.open("/kviz", "_self");
  };

  if (questions.length === 0) {
    const filteredRowsForSelect = selectedLevel === "all"
      ? allRows
      : allRows.filter(row => Number(row[4]) <= Number(selectedLevel));
    return (
      <div className="test-setup">
        <h1>Level 9 – Igeragozás gyakorlatok</h1>
        <div className="setup-group">
          <label>Hány kérdés legyen:</label>
          <select value={numQuestions} onChange={handleNumQuestionsChange}>
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
        <div className="setup-group">
          <label>Ige szintje:</label>
          <select value={selectedLevel} onChange={handleLevelChange} disabled={selectedVerbIndex !== "random"}>
            <option value="all">Összes</option>
            {["0","1", "2", "3", "4", "5", "6", "7", "8", "9"].map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
        <div className="setup-group">
          <label>Válassz igét:</label>
          <select value={selectedVerbIndex} onChange={handleVerbChange} disabled={selectedLevel !== "all"}>
            <option value="random">Random</option>
            {filteredRowsForSelect.map((row, index) =>
              row[6] && <option key={index} value={index}>{row[6]}</option>
            )}
          </select>
        </div>
        <div className="setup-group">
          <label>Válassz igeidőt:</label>
          <select value={selectedTenseIndex} onChange={handleTenseChange}>
            <option value="random">Random</option>
            {tenses.map((tense, index) => (
              <option
                key={index}
                value={index}
                hidden={["Infinitivo", "Gerundio", "Participio", "Level"].includes(tense.label)}
              >
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
        activeVerbRow={questions[currentQuestionIndex].verbRow}
        activeTense={questions[currentQuestionIndex].tense}
        userAnswers={userAnswers[currentQuestionIndex]}
        setUserAnswers={(answers) => {
          const newUserAnswers = [...userAnswers];
          newUserAnswers[currentQuestionIndex] = answers;
          setUserAnswers(newUserAnswers);
        }}
        handleNextQuestion={handleNextQuestion}
        questionsLength = {questions.length}
      />
    </div>
  );
};

export default Level9;
