import React, { useState } from 'react';
import '../../../styles/DemoContent2.css';

const Card = ({ spanish, english, hungarian }) => {

    const handleSpeakSpanish = () => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(spanish);
            utterance.lang = 'es-ES'; // Spanish language code
            utterance.rate = 0.85;
            window.speechSynthesis.speak(utterance);
        } else {
            alert('Ez a böngésző nem támogatja a beszédszintézist.');
        }
    };

    const handleSpeakEnglish = () => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(english);
            utterance.lang = 'en-GB'; // English language code
            utterance.rate = 0.85;
            window.speechSynthesis.speak(utterance);
        } else {
            alert('Ez a böngésző nem támogatja a beszédszintézist.');
        }
    };

    const handleSpeakHungarian = () => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(hungarian);
            utterance.lang = 'hu-HU'; // Hungarian language code
            utterance.rate = 0.85;
            window.speechSynthesis.speak(utterance);
        } else {
            alert('Ez a böngésző nem támogatja a beszédszintézist.');
        }
    };

    return (
        <div className="card">
            <div className="card-content">
                <div className="language-item">
                    <span className="flag flag-es" role="img" aria-label="Spanish"></span>
                    <p className="language-text">{spanish}</p>
                    {/* Gomb a spanyol szöveg felolvasásához */}
                    <span className="speaker-icon" onClick={handleSpeakSpanish}>🔊</span>
                </div>
                <div className="language-item">
                    <span className="flag flag-gb" role="img" aria-label="English"></span>
                    <p className="language-text">{english}</p>
                    <span className="speaker-icon" onClick={handleSpeakEnglish}>🔊</span>
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

const DemoContent2 = ({ testType, startQuiz, items }) => {
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

    const handleStartQuiz = () => {
        startQuiz();
    };

    if (!items || items.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className="demo-content">
            <h1 className="demo-contenth1">Tanuld meg először a kifejezéseket</h1>
            <Card
                spanish={items[currentIndex].spanish}
                english={items[currentIndex].english}
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
            <button className="start-quiz-btn" onClick={handleStartQuiz}>
                Kezdés
            </button>
        </div>
    );
};

export default DemoContent2;
