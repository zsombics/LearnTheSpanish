import React from 'react';

const AllTimeStats = ({ overallPercentage, totalQuizzes, totalCorrect, totalQuestions }) => {
  return (
    <div className="all-time-stats">
      <h3>Összesített statisztika</h3>
      <div className="stat-item">
        <span className="stat-label">Teljes pontosság:</span>
        <span className="stat-value" style={{fontSize: "1em"}}>{overallPercentage}%</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Kitöltött kvízek:</span>
        <span className="stat-value" style={{fontSize: "1em"}}>{totalQuizzes}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Megválaszolt kérdések:</span>
        <span className="stat-value" style={{fontSize: "1em"}}>{totalCorrect}/{totalQuestions}</span>
      </div>
    </div>
  );
};

export default AllTimeStats; 