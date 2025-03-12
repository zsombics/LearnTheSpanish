import React, { useEffect, useState } from 'react';

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
  const [verbRow, setVerbRow] = useState(null);
  const [translatedText, setTranslatedText] = useState('');
  const [error, setError] = useState('');

  // Egyszerű CSV parser: sorokra bontás, majd cellákra osztás
  const parseCSV = (text) => {
    const rows = text.split('\n').map(row => row.split(',').map(cell => cell.trim()));
    return rows;
  };

  // Automatikus fordítás az API segítségével
  const translateVerb = async (textToTranslate) => {
    try {
      const response = await fetch("http://localhost:5000/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToTranslate }),
      });
      const data = await response.json();
      if (data.translations && data.translations.length > 0) {
        setTranslatedText(data.translations[0].text);
      } else {
        setError('Nem sikerült lefordítani a szót.');
      }
    } catch (err) {
      console.error(err);
      setError('Hálózati hiba történt.');
    }
  };

  useEffect(() => {
    // A CSV fájl a level8 mappában található
    fetch('level8/proba.csv')
      .then(response => response.text())
      .then(text => {
        const rows = parseCSV(text);
        if (rows && rows.length > 0) {
          setVerbRow(rows[0]);
          // Az infinitív (ige) a 7. oszlopban található (index: 6)
          if (rows[0].length > 6) {
            translateVerb(rows[0][6]);
          }
        }
      })
      .catch(err => console.error('Hiba a CSV beolvasásánál:', err));
  }, []);

  return (
    <div>
      <h1>Level 8</h1>
      <p>Welcome to Level 8!</p>
      {verbRow ? (
        <div>
          <h2>
            Ige: {verbRow[6]} 
            {translatedText && <span> — Fordítás: {translatedText}</span>}
          </h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {tenses.map((tense, tIndex) => (
            <div key={tIndex} style={{ marginBottom: '1rem' }}>
              <h3>{tense.label}</h3>
              {tense.persons ? (
                <table border="1" cellPadding="4">
                  <thead>
                    <tr>
                      <th>Személy</th>
                      <th>Ragozás</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tense.indices.map((colIndex, index) => (
                      <tr key={index}>
                        <td>{tense.persons[index]}</td>
                        <td>{verbRow[colIndex] || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>{verbRow[tense.indices[0]] || '-'}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>CSV fájl beolvasása folyamatban…</p>
      )}
    </div>
  );
};

export default Level8;
