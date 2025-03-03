// src/components/Levels/quizTypes/TrueFalseQuiz.js
import React from 'react';

function TrueFalseQuiz({ currentQuestion, selectedOption, handleOptionSelect, showFeedback }) {
  return (
    <div className="question-card">
      <h2 className="question-text">{currentQuestion.question}</h2>
      <div className="options">
        {["Helyes", "Helytelen"].map((option, index) => {
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
              Hibás válasz! {currentQuestion.explanation}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default TrueFalseQuiz;
