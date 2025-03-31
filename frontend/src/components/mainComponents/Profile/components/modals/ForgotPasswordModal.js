import React from 'react';

const ForgotPasswordModal = ({ 
  isOpen, 
  closeModal, 
  forgotPasswordEmail, 
  setForgotPasswordEmail, 
  handleForgotPassword, 
  forgotPasswordMessage 
}) => {
  if (!isOpen) return null;

  return (
    <div className="avatar-modal">
      <div className="modal-content">
        <button className="modal-close" onClick={closeModal}>×</button>
        <div className="modal-header">
          <h3>Elfelejtett jelszó</h3>
        </div>
        <p>Add meg az email címed, és küldünk egy linket a jelszó visszaállításához.</p>
        <form onSubmit={handleForgotPassword} className="password-form">
          <div className="form-group">
            <label htmlFor="forgotPasswordEmail">Email cím:</label>
            <input
              type="email"
              id="forgotPasswordEmail"
              value={forgotPasswordEmail}
              onChange={(e) => setForgotPasswordEmail(e.target.value)}
              required
            />
          </div>
          {forgotPasswordMessage && (
            <p className={`message ${forgotPasswordMessage.includes('Hiba') ? 'error' : 'success'}`}>
              {forgotPasswordMessage}
            </p>
          )}
          <div className="button-container">
            <button type="submit" className="submit-button">Küldés</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordModal; 