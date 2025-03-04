import React, { useState } from 'react';
import '../styles/MainQuizSite.css';
import Level1 from './Levels/Level1';
import Level2 from './Levels/Level2';
import Level3 from './Levels/Level3';
import Level4 from './Levels/Level4';
import Level5 from './Levels/Level5';
import Level6 from './Levels/Level6';
import Level7 from './Levels/Level7';
// Ha további szintek komponenseit is importálni szeretnéd, azt itt teheted meg
// import Level2 from './Levels/Level2';
// import Level3 from './Levels/Level3';
// stb.

function MainQuizSite() {
  const [selectedLevel, setSelectedLevel] = useState(null);

  // 9 szint, 1-től 9-ig
  const levels = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
  };

  // Ha egy szint ki van választva, azt megjelenítjük
  if (selectedLevel !== null) {
    switch (selectedLevel) {
      case 1:
        return <Level1 />;
      // Ha később importálod a többi szint komponenst, azt itt így adhatod meg:
      case 2:
        return <Level2 />;
      case 3:
        return <Level3 />;
      case 4:
        return <Level4 />;
      case 5:
        return <Level5 />;
      case  6:
        return <Level6 />;
      case 7:
        return <Level7 />;
      // case 3:
      //   return <Level3 />;
      // ...
      default:
        return (
          <div className="level-not-implemented">
            <h2>A(z) {selectedLevel}. szint oldal még nincs implementálva.</h2>
          </div>
        );
    }
  }

  // Ha még nincs kiválasztva szint, akkor megjelenítjük a szintválasztó oldalt
  return (
    <div className="main-quiz-site">
      <div className="auth-text">
        <h1>Üdvözöl a Spanyol Oktató Program!</h1>
        <p>
          Tanulj spanyolul élményszerűen, interaktív kvízekkel és modern tanulási módszerekkel.
          Válaszd ki a kezdő szinted!
        </p>
      </div>
      <div className="questions-container">
        <h1>Válaszd ki a saját szinted</h1>
        <div className="levels-container">
          {levels.map((level) => (
            <button
              key={level}
              className="level-button"
              onClick={() => handleLevelSelect(level)}
            >
              {level}. szint
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MainQuizSite;
