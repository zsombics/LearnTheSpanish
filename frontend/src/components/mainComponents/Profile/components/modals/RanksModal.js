import React from 'react';

const RanksModal = ({ isOpen, closeModal, ranksData }) => {
  if (!isOpen) return null;

  return (
    <div className="ranks-modal">
      <div className="modal-content">
        <button className="modal-close" onClick={closeModal}>×</button>
        <div className="modal-header">
          <h3>Rangok és feltételek</h3>
        </div>
        <div className="ranks-tables">
          <div className="ranks-section">
            <h4>Teljesítmény Szintek</h4>
            <table className="ranks-table">
              <thead>
                <tr>
                  <th>Szint</th>
                  <th>Szimbólum</th>
                  <th>Százalék</th>
                </tr>
              </thead>
              <tbody>
                {ranksData.performanceLevels.map((level) => (
                  <tr key={level.level}>
                    <td>{level.level}</td>
                    <td>{level.symbol}</td>
                    <td>{level.range}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="ranks-section">
            <h4>Account Szintek</h4>
            <table className="ranks-table">
              <thead>
                <tr>
                  <th>Szint</th>
                  <th>Megnevezés</th>
                  <th>Kérdőívek</th>
                </tr>
              </thead>
              <tbody>
                {ranksData.accountLevels.map((level) => (
                  <tr key={level.level}>
                    <td>{level.level}</td>
                    <td>{level.name}</td>
                    <td>{level.range}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RanksModal; 