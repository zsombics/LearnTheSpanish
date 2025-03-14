import React, { useState, useEffect } from 'react';
import '../../../styles/FillTheBlank.css';

function highlightDifferences(userInput, correctAnswer) {
  const userChars = userInput.split('');
  const correctChars = correctAnswer.split('');
  const maxLength = Math.max(userChars.length, correctChars.length);
  let correctCount = 0;
  let result = '';

  for (let i = 0; i < maxLength; i++) {
    const userChar = userChars[i] || '';
    const correctChar = correctChars[i] || '';
    if (userChar === correctChar) {
      result += `<span class="correct-char">${userChar}</span>`;
      correctCount++;
    } else {
      result += `<span class="incorrect-char">${userChar || ' '}</span>`;
    }
  }
  const percentageCorrect = ((correctCount / correctAnswer.length) * 100).toFixed(2);
  return { highlightedText: result, percentageCorrect };
}

const VerbQuiz2 = ({ activeVerbRow, activeTense, userAnswers, setUserAnswers, finishTest }) => {
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (activeTense && activeTense.indices) {
      const effectiveCount = activeTense.indices.length;
      if (!userAnswers || userAnswers.length !== effectiveCount) {
        setUserAnswers(Array(effectiveCount).fill(''));
      }
    }
  }, [activeTense, setUserAnswers, userAnswers]);

  if (!activeVerbRow || !activeTense) {
    return (
      <div className="test-page">
        <p className="question-card">Nincs elérhető ige vagy igeidő a teszthez.</p>
      </div>
    );
  }

  const defaultImperativePersons = ["tú", "usted", "nosotros", "vosotros", "ustedes"];
  const personsToDisplay = (activeTense.persons && activeTense.persons.length > 0)
    ? activeTense.persons
    : (activeTense.label.includes("Imperativo") ? defaultImperativePersons : []);
  const indicesToDisplay = activeTense.indices || [];

  const handleInputChange = (index, value) => {
    const updated = [...userAnswers];
    updated[index] = value;
    setUserAnswers(updated);
  };

  const checkAnswers = () => {
    setShowFeedback(true);
  };

  return (
    <div className="test-page">
      <div className="question-card verb-quiz">
        <h1 className="question-title">Igeidő – {activeTense.label}</h1>
        <h2 className="question-subtitle">Ige: {activeVerbRow[6]}</h2>
        <div className="quiz-container">
          {personsToDisplay.map((person, index) => {
            const correctAnswer = activeVerbRow[indicesToDisplay[index]] || '';
            return (
              <div key={index} className="quiz-row">
                <div className="quiz-person">
                  <strong>{person}</strong>
                </div>
                <div className="quiz-input">
                  <input
                    type="text"
                    value={userAnswers[index] || ""}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    placeholder="Írd be a ragozást..."
                    className="input-field"
                  />
                </div>
                {showFeedback && (
                  <div className="quiz-feedback">
                    {(() => {
                      const { highlightedText, percentageCorrect } = highlightDifferences(
                        userAnswers[index] ? userAnswers[index].trim() : '',
                        correctAnswer
                      );
                      return (
                        <div>
                          <div
                            className="highlighted-feedback"
                            dangerouslySetInnerHTML={{ __html: highlightedText }}
                          />
                          <p className="percentage-correct">Helyesség: {percentageCorrect}%</p>
                          <p className="correct-answer-display">Helyes válasz: {correctAnswer}</p>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="quiz-navigation">
          <button className="check-btn" onClick={checkAnswers}>Ellenőriz</button>
          <button className="check-btn" onClick={finishTest}>Befejezés</button>
        </div>
      </div>
    </div>
  );
};

export default VerbQuiz2;
