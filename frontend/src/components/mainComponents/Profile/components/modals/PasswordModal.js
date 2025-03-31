import React from 'react';

const PasswordModal = ({ 
  isOpen, 
  closeModal, 
  passwordData, 
  setPasswordData, 
  handlePasswordChange, 
  passwordError,
  setIsForgotPasswordModalOpen 
}) => {
  if (!isOpen) return null;

  return (
    <div className="avatar-modal">
      <div className="modal-content">
        <button className="modal-close" onClick={closeModal}>×</button>
        <div className="modal-header">
          <h3>Jelszó módosítása</h3>
        </div>
        <form onSubmit={handlePasswordChange} className="password-form">
          <div className="form-group">
            <label htmlFor="currentPassword">Jelenlegi jelszó:</label>
            <input
              type="password"
              id="currentPassword"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">Új jelszó:</label>
            <input
              type="password"
              id="newPassword"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Új jelszó megerősítése:</label>
            <input
              type="password"
              id="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
              required
            />
          </div>
          {passwordError && <div className="error-message">{passwordError}</div>}
          <div className="button-container">
            <button type="submit" className="submit-button">Módosítás</button>
          </div>
          <span className="forgot-password-text">
            Elfelejtetted a jelszavad? <span className="forgot-password-link" onClick={() => {
              closeModal();
              setIsForgotPasswordModalOpen(true);
            }}>Kattints ide</span>
          </span>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal; 