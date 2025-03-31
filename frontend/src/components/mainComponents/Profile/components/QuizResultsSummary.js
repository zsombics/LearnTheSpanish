import React from 'react';

const QuizResultsSummary = ({ quizResults }) => {
  if (quizResults.length === 0) return null;

  return (
    <div className="quiz-results-summary">
      <h3 style={{ marginBottom: '5px' }}>Legutóbbi eredmények</h3>
      <ul className="results-list">
        {quizResults.slice(0, 9).map((result) => (
          <li key={result._id} className="result-item">
            <span className="result-date">
              {new Date(result.createdAt).toLocaleDateString('hu-HU')}
            </span>
            <span className="result-score">
              {result.correctAnswers}/{result.totalQuestions}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizResultsSummary; 