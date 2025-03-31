import React from 'react';

const LeaderboardModal = ({ 
  isOpen, 
  closeModal, 
  leaderboardData, 
  leaderboardType, 
  setLeaderboardType, 
  user, 
  getPerformanceLevelSymbol 
}) => {
  if (!isOpen) return null;

  return (
    <div className="leaderboard-modal">
      <div className="modal-content">
        <button className="modal-close" onClick={closeModal}>×</button>
        <div className="modal-header">
          <h3>Ranglista</h3>
          <div className="leaderboard-type-selector">
            <button 
              className={`type-button ${leaderboardType === 'accuracy' ? 'active' : ''}`}
              onClick={() => setLeaderboardType('accuracy')}
            >
              Pontosság
            </button>
            <button 
              className={`type-button ${leaderboardType === 'quizzes' ? 'active' : ''}`}
              onClick={() => setLeaderboardType('quizzes')}
            >
              Kitöltött tesztek
            </button>
          </div>
        </div>
        <div className="leaderboard-list">
          {[...leaderboardData]
            .sort((a, b) => {
              if (leaderboardType === 'accuracy') {
                return b.totalAccuracy - a.totalAccuracy;
              } else {
                return b.totalQuizzes - a.totalQuizzes;
              }
            })
            .map((userData, index) => (
              <div 
                key={userData._id} 
                className={`leaderboard-item ${userData._id === user._id ? 'current-user' : ''}`}
              >
                <span className="rank-number">{index + 1}.</span>
                <div className="user-info-container">
                  <img 
                    src={userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`} 
                    alt={`${userData.name} avatárja`} 
                    className="leaderboard-avatar"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`;
                    }}
                  />
                  <span className="user-name">{userData.name}</span>
                </div>
                <span className="user-level">{getPerformanceLevelSymbol(userData.performanceLevel)}</span>
                <span className="user-accuracy">
                  {leaderboardType === 'accuracy' 
                    ? `${userData.totalAccuracy.toFixed(1)}%`
                    : `${userData.totalQuizzes} db`
                  }
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardModal; 