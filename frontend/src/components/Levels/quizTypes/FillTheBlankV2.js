// src/components/Levels/quizTypes/FillInTheBlankV2.js
import React from 'react';
import 'D:/LearnTheSpanish/frontend/src/styles/FillTheBlank.css';

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


function FillInTheBlankQuiz({ currentQuestion, typedAnswer, handleAnswerChange, showFeedback }) {
  const { highlightedText, percentageCorrect } = highlightDifferences(typedAnswer.trim(), currentQuestion.correctAnswer);

  return (
    <div className="question-card">
      <h2 className="question-text">{currentQuestion.question}</h2>
      <div className="answer-input">
        <input
          type="text"
          placeholder="Írd be a válaszodat..."
          value={typedAnswer}
          onChange={handleAnswerChange}
        />
      </div>
      {showFeedback && (
        <div className="feedback">
        <p>Válaszod:</p>
        <div
          className="highlighted-feedback"
          dangerouslySetInnerHTML={{ __html: highlightedText }}
        />
        <p className="percentage-correct">Helyes karakterek százaléka: {percentageCorrect}%</p>
        <p className="correct-answer-display">Helyes válasz: {currentQuestion.correctAnswer}</p>
      </div>
      )}
    </div>
  );
}

export default FillInTheBlankQuiz;
