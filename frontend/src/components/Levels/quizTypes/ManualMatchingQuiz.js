// src/components/Levels/quizTypes/ManualMatchingQuiz.js
import React from 'react';
import 'D:/LearnTheSpanish/frontend/src/styles/Levels.css';

function ManualMatchingQuiz({ currentQuestion, typedAnswer, handleAnswerChange, showFeedback }) {
  return (
    <div className="question-card">
      {/* The question text should ask: "What is the Hungarian translation for the Spanish adjective: [word]?" */}
      <h2 className="question-text">{currentQuestion.question}</h2>
      <div className="answer-input">
        <input
          type="text"
          placeholder="Írd be a helyes választ..."
          value={typedAnswer}
          onChange={handleAnswerChange}
        />
      </div>
      {showFeedback && (
        <div className="feedback">
          {typedAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.toLowerCase() ? (
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

export default ManualMatchingQuiz;
