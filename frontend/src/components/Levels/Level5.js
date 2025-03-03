import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'D:/LearnTheSpanish/frontend/src/styles/Levels.css';
import 'D:/LearnTheSpanish/frontend/src/styles/DemoContent2.css';

const Card = ({ spanish, english, hungarian }) => {
  const handleSpeakSpanish = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(english);
      utterance.lang = 'es-ES';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Ez a böngésző nem támogatja a beszédszintézist.');
    }
  };

  const handleSpeakHungarian = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(hungarian);
      utterance.lang = 'hu-HU';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Ez a böngésző nem támogatja a beszédszintézist.');
    }
  };

  return (
    <div className="card">
      <h1 className="h1language-text">{spanish}</h1>
      <div className="card-content">
        <div className="language-item">
          <span className="flag flag-es" role="img" aria-label="Spanish"></span>
          <p className="language-text">{english}</p>
          <span className="speaker-icon" onClick={handleSpeakSpanish}>🔊</span>
        </div>
        <div className="language-item">
          <span className="flag flag-hu" role="img" aria-label="Hungarian"></span>
          <p className="language-text">{hungarian}</p>
          <span className="speaker-icon" onClick={handleSpeakHungarian}>🔊</span>
        </div>
      </div>
    </div>
  );
};


const DemoContent2 = ({ testType, stopQuiz, items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleStopQuiz = () => {
    stopQuiz();
  };

  if (!items || items.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="demo-content">
      <h1 className="demo-contenth1">Tanuld meg használni a betűket</h1>
      <Card
        spanish={items[currentIndex].letter}
        english={items[currentIndex].example}
        hungarian={items[currentIndex].hungarian}
      />
      <div className="navigation">
        <button onClick={handlePrevious} disabled={currentIndex === 0}>
          Előző
        </button>
        <button onClick={handleNext} disabled={currentIndex === items.length - 1}>
          Következő
        </button>
      </div>
      <button className="start-quiz-btn" onClick={handleStopQuiz}>
        Befejezem
      </button>
    </div>
  );
};

const Level5 = () => {
  const [letters, setLetters] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/letters.csv');
        const data = await response.text();
        const rows = data.split('\n');
        const parsedData = rows.map(row => {
          const [letter, example, hungarian] = row.split(';');
          return {
            letter: letter.trim(),
            example: example.trim(),
            hungarian: hungarian.trim()
          };
        });
        setLetters(parsedData);
      } catch (error) {
        console.error('Error loading CSV:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <DemoContent2 items={letters} stopQuiz={() => { window.open("/kviz", "_self"); }} />
    </div>
  );
};

export default Level5;