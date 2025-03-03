import React from 'react';

function MultipleChoiceQuiz({ currentQuestion, selectedOption, handleOptionSelect, showFeedback }) {
  return (
    <div className="question-card">
      <h2 className="question-text">{currentQuestion.question}</h2>
      <div className="options">
        {currentQuestion.options.map((option, index) => {
          let btnClass = "btn-outline-primary";
          if (showFeedback) {
            btnClass = option === currentQuestion.correctAnswer 
              ? "btn-success" 
              : option === selectedOption 
                ? "btn-danger" 
                : "btn-outline-secondary";
          } else if (selectedOption === option) {
            btnClass = "btn-outline-success";
          }

          return (
            <button
              key={index}
              className={`btn ${btnClass} option-btn`}
              onClick={() => handleOptionSelect(option)}
              disabled={showFeedback}
            >
              {option}
            </button>
          );
        })}
      </div>
      {showFeedback && (
        <div className="feedback">
          {selectedOption === currentQuestion.correctAnswer ? (
            <p className="correct-feedback">✓ Correct answer!</p>
          ) : (
            <p className="incorrect-feedback">
              ✗ Wrong answer! Correct:{" "}
              <span className="correct-answer">
                {currentQuestion.correctAnswer}
              </span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default MultipleChoiceQuiz;