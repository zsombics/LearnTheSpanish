// src/components/Levels/quizTypes/MatchingQuiz.js
import React from 'react';

function MatchingQuiz({ currentQuestion, selectedOption, handleOptionSelect, showFeedback }) {
  return (
    <div className="question-card">
      <h2 className="question-text">{currentQuestion.question}</h2>
      <div className="options">
        {currentQuestion.options.map((option, index) => {
          let labelClass = "btn";
          if (showFeedback) {
            labelClass += option === currentQuestion.correctAnswer ? " btn-success" : option === selectedOption ? " btn-danger" : " btn-outline-secondary";
          } else {
            labelClass += selectedOption === option ? " btn-outline-success" : " btn-outline-primary";
          }
          return (
            <button
              key={index}
              className={`${labelClass} option-btn`}
              onClick={() => handleOptionSelect(option)}
            >
              {option}
            </button>
          );
        })}
      </div>
      {showFeedback && (
        <div className="feedback">
          {selectedOption === currentQuestion.correctAnswer ? (
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

export default MatchingQuiz;
