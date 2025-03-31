import React from 'react';

const AvatarSection = ({ avatar, openModal }) => {
  return (
    <div className="avatar-section">
      <img
        src={avatar}
        alt="Felhasználó avatárja"
        className="avatar-image"
        onClick={openModal}
      />
      <button
        className="avatar-change-button"
        onClick={openModal}
      >
        Avatar változtatása
      </button>
    </div>
  );
};

export default AvatarSection; 