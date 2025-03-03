// src/components/Levels/quizTypes/FillInTheBlankQuiz.js
import React from 'react';

function FillInTheBlankQuiz({ currentQuestion, typedAnswer, handleAnswerChange, showFeedback }) {
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
          {typedAnswer.trim() === currentQuestion.correctAnswer ? (
            <p className="correct-feedback">Helyes válasz!</p>
          ) : (
            <p className="incorrect-feedback">
              Hibás válasz! A helyes válasz: <span className="correct-answer">{currentQuestion.correctAnswer}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default FillInTheBlankQuiz;
