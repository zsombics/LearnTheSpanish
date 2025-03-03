import React, { useState, useEffect } from 'react';

function WordQuiz() {
  // Állapotok
  const [wordPairs, setWordPairs] = useState([]);       // A CSV-ből beolvasott szó párok
  const [quizQuestions, setQuizQuestions] = useState([]); // A kiválasztott kviz kérdések
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizMode, setQuizMode] = useState(null);         // 'spanyol-magyar' vagy 'magyar-spanyol'
  const [userAnswer, setUserAnswer] = useState('');

  // A CSV fájl beolvasása a komponens betöltésekor
  useEffect(() => {
    // A fájlt a public mappából kell betölteni
    fetch('/words.csv')
      .then(response => {
        if (!response.ok) {
          throw new Error('Hiba történt a CSV fájl betöltésekor!');
        }
        return response.text();
      })
      .then(data => {
        const pairs = parseCSV(data);
        setWordPairs(pairs);
      })
      .catch(error => console.error('Hiba a CSV beolvasásakor:', error));
  }, []);

  // CSV feldolgozó függvény: sorokra bontás, majd az egyes sorok vessző mentén történő felbontása
  function parseCSV(data) {
    // Szétszedjük a fájlt sorokra, majd a sorokat vessző mentén tömbbé alakítjuk,
    // szűrve az üres sorokat.
    return data
      .split('\n')
      .map(row => row.trim())
      .filter(row => row !== '')
      .map(row => row.split(',').map(item => item.trim()))
      .filter(pair => pair.length === 2 && pair[0] && pair[1]);
  }

  // Kviz indítása a kiválasztott mód szerint
  const startQuiz = (mode) => {
    if (wordPairs.length === 0) {
      alert('A szó párok betöltése folyamatban vagy sikertelen. Próbáld újra később!');
      return;
    }
    setQuizMode(mode);
    let questions = [];
    if (mode === 'magyar-spanyol') {
      // Az első elem a magyar szó, a második a spanyol fordítás
      questions = wordPairs.map(pair => [pair[0], pair[1]]);
    } else {
      // Spanyol-magyar: az első elem a spanyol szó, a második a magyar fordítás
      questions = wordPairs.map(pair => [pair[1], pair[0]]);
    }
    // Keverjük meg a kérdéseket, és válasszuk ki az első 5-öt (vagy kevesebbet, ha nincs elég adat)
    questions = shuffleArray(questions).slice(0, Math.min(5, questions.length));
    setQuizQuestions(questions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setUserAnswer('');
  };

  // Következő kérdés kezelése
  const nextQuestion = () => {
    if (quizQuestions.length === 0) return;
    const correctAnswer = quizQuestions[currentQuestionIndex][1].toLowerCase();
    if (userAnswer.trim().toLowerCase() === correctAnswer) {
      setScore(prevScore => prevScore + 1);
    }
    setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    setUserAnswer('');
  };

  // Kviz vége
  const endQuiz = () => {
    setQuizMode(null);
  };

  // Segédfüggvény: tömb keverése (Fisher-Yates algoritmus)
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Ha nincs kviz mód kiválasztva, jelenítsük meg az indítás gombokat
  if (!quizMode) {
    return (
      <div className="quiz">
        <h2>Spanyol-Magyar Szó Kvíz</h2>
        <button onClick={() => startQuiz('spanyol-magyar')}>Spanyol → Magyar</button>
        <button onClick={() => startQuiz('magyar-spanyol')}>Magyar → Spanyol</button>
      </div>
    );
  }

  // Ha még van kérdés
  if (currentQuestionIndex < quizQuestions.length) {
    return (
      <div className="quiz">
        <h2>Kérdés: {quizQuestions[currentQuestionIndex][0]}</h2>
        <input
          type="text"
          placeholder="Írd be a fordítást"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              nextQuestion();
            }
          }}
        />
        <button onClick={nextQuestion}>Következő</button>
        <p>Pontszám: {score} / {quizQuestions.length}</p>
      </div>
    );
  } else {
    // A kviz véget ért
    return (
      <div className="quiz">
        <h2>Kvíz vége!</h2>
        <p>Pontszám: {score} / {quizQuestions.length}</p>
        <button onClick={endQuiz}>Új kvíz</button>
      </div>
    );
  }
}

export default WordQuiz;
