import React from 'react';

const UserInfo = ({ user, getPerformanceLevelSymbol, setIsRanksModalOpen }) => {
  return (
    <div className="user-info">
      <h2 className="user-name">{user.name}</h2>
      <p className="user-email">{user.email}</p>
      <div className="user-levels">
        <div 
          className="level-badge performance" 
          data-level={user.performanceLevel}
          onClick={() => setIsRanksModalOpen(true)}
        >
          <span className="level-symbol">{getPerformanceLevelSymbol(user.performanceLevel)}</span>
        </div>
        <div 
          className="level-badge account" 
          onClick={() => setIsRanksModalOpen(true)}
        >
          <span className="level-name">{user.accountLevelName}</span>
        </div>
      </div>
    </div>
  );
};

export default UserInfo; 