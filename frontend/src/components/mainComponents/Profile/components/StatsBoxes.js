import React from 'react';

const StatsBoxes = ({ user, getUserRank, setIsLeaderboardModalOpen }) => {
  return (
    <div className="stats-boxes">
      <div className="stat-box" onClick={() => setIsLeaderboardModalOpen(true)}>
        <div className="stat-box-content">
          <h3>Teljes pontosság</h3>
          <div className="stat-value">{user.totalAccuracy.toFixed(1)}%</div>
          <div className="stat-rank">
            {getUserRank('accuracy')}. hely a ranglistán
          </div>
        </div>
      </div>
      <div className="stat-box" onClick={() => setIsLeaderboardModalOpen(true)}>
        <div className="stat-box-content">
          <h3>Kitöltött kvízek</h3>
          <div className="stat-value">{user.totalQuizzes}</div>
          <div className="stat-rank">
            {getUserRank('quizzes')}. hely a ranglistán
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsBoxes; 