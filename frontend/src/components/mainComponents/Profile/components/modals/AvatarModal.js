import React from 'react';

const AvatarModal = ({ isOpen, closeModal, avatarOptions, avatar, selectAvatar }) => {
  if (!isOpen) return null;

  return (
    <div className="avatar-modal">
      <div className="modal-content">
      <button className="modal-close" onClick={closeModal}>x</button>
        <div className="modal-header">
          <h3>Válassz új avatárt</h3>
        </div>
        <div className="avatar-grid">
          {avatarOptions.map((option, index) => (
            <div
              key={index}
              className={`avatar-option ${avatar === option ? 'selected' : ''}`}
              onClick={() => selectAvatar(option)}
            >
              <img
                src={option}
                alt={`Avatar ${index + 1}`}
                className="avatar-thumbnail"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvatarModal; 