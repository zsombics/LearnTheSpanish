import React, { useEffect, useState } from 'react';
import '../../styles/Levels.css';
import VerbQuiz from '../Levels/quizTypes/VerbQuiz';

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

const Level8 = () => {
  const [allRows, setAllRows] = useState([]);
  const [selectedVerbIndex, setSelectedVerbIndex] = useState("random");
  const [selectedTenseIndex, setSelectedTenseIndex] = useState("random");

  const [activeVerbRow, setActiveVerbRow] = useState(null);
  const [activeTense, setActiveTense] = useState(null);

  const [error, setError] = useState('');

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

  const applySelections = () => {
    let verbRow;
    if (selectedVerbIndex === "random") {
      const randomIndex = Math.floor(Math.random() * allRows.length);
      verbRow = allRows[randomIndex];
    } else {
      verbRow = allRows[selectedVerbIndex];
    }
    setActiveVerbRow(verbRow);

    let tense;
    if (selectedTenseIndex === "random") {
      const randomIndex = Math.floor(Math.random() * tenses.length);
      tense = tenses[randomIndex];
    } else {
      tense = tenses[selectedTenseIndex];
    }
    setActiveTense(tense);
    console.log("Selected verb row:", verbRow);
    console.log("Selected tense:", tense);
  };

  return (
    <div className="level8-container">
      {activeVerbRow && activeTense ? (
        <VerbQuiz activeVerbRow={activeVerbRow} activeTense={activeTense} />
      ) : (
        <div className="test-setup">
          <h1>Level 8 – Igeragozás</h1>
          <div className="setup-group">
            <label>
              Válassz igét:
              <select value={selectedVerbIndex} onChange={handleVerbChange}>
                <option value="random">Random</option>
                {allRows.map((row, index) =>
                  row[6] && <option key={index} value={index}>{row[6]}</option>
                )}
              </select>
            </label>
          </div>
          <div className="setup-group">
            <label>
              Válassz igeidőt:
              <select value={selectedTenseIndex} onChange={handleTenseChange}>
                <option value="random">Random</option>
                {tenses.map((tense, index) => (
                  <option key={index} value={index}>{tense.label}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="setup-group">
            <button className="start-test-btn" onClick={applySelections}>
              Alkalmaz
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Level8;
