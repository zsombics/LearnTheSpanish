import React from 'react';
import '../../styles/Levels.css';

function DemoContent({ testType, startQuiz }) {
  const renderDemoContent = () => {
    switch (testType) {
      case "multiple-choice":
        return (
          <div className="demo-section">
            <h2>Többszörös választásos teszt</h2>
            <div className="demo-card">
              <p>Válaszd ki a helyes melléknév alakot a megadott lehetőségek közül!</p>
              <div className="example-grid">
                <div className="example-column">
                  <h3>Példa feladat</h3>
                  <p className="demo-question">La casa es ___ (beautiful)</p>
                  <div className="options">
                    <button className="btn btn-outline-primary">bonito</button>
                    <button className="btn btn-success">bonita</button>
                    <button className="btn btn-outline-primary">bonitos</button>
                  </div>
                  <p className="demo-hint">⚠️ Figyelj a főnév nemére és számára! (casa → nőnem egyes szám)</p>
                </div>
                <div className="rule-block">
                  <h3>Szabályok</h3>
                  <ul>
                    <li>A melléknév mindig egyezzen a főnévvel nemben és számban</li>
                    <li>Nőnemű végződések: -a, -as, -es</li>
                    <li>Semleges végződések: -e, -ista</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case "fill-in-the-blank":
        return (
          <div className="demo-section">
            <h2>Kiegészítős feladat</h2>
            <div className="demo-card">
              <p>Írd be a helyes melléknév alakot a hiányzó helyre!</p>
              <div className="example-grid">
                <div className="example-column">
                  <h3>Példa feladat</h3>
                  <p className="demo-question">Los chicos son ___ (funny)</p>
                  <div className="answer-input">
                    <input type="text" value="divertidos" readOnly />
                  </div>
                  <p className="demo-hint">⚠️ Többes számú hímnemű főnév → -os végződés</p>
                </div>
                <div className="rule-block">
                  <h3>Szabályok</h3>
                  <ul>
                    <li>Egyes szám: -o/-a</li>
                    <li>Többes szám: -os/-as</li>
                    <li>Nemi egyeztetés kötelező</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case "matching":
        return (
          <div className="demo-section">
            <h2>Párosító feladat</h2>
            <div className="demo-card">
              <p>Párosítsd a mellékneveket a megfelelő magyar jelentésekkel!</p>
              <div className="matching-grid">
                <div className="matching-pair">
                  <span className="adjective">dócil</span>
                  <span className="separator">→</span>
                  <span className="form">engedékeny</span>
                </div>
                <div className="matching-pair">
                  <span className="adjective">dogmatikus</span>
                  <span className="separator">→</span>
                  <span className="form">kedvelt</span>
                </div>
              </div>
              <p className="demo-hint">⚠️ Válassz a megfelelő magyar jelentések közül</p>
            </div>
          </div>
        );

      case "drag-and-drop":
        return (
          <div className="demo-section">
            <h2>Átrendezős feladat</h2>
            <div className="demo-card">
              <p>Helyezd sorrendbe a szavakat helyes mondat kialakításához!</p>
              <div className="drag-demo">
                <div className="word-box">es</div>
                <div className="word-box">casa</div>
                <div className="word-box">La</div>
                <div className="word-box">bonita</div>
              </div>
              <p className="correct-order">La casa es bonita</p>
              <p className="demo-hint">⚠️ A melléknév általában a főnév UTÁN áll</p>
            </div>
          </div>
        );

      case "true-false":
        return (
          <div className="demo-section">
            <h2>Helyes/Helytelen feladat</h2>
            <div className="demo-card">
              <p>Döntsd el, helyes-e a melléknév használata!</p>
              <div className="tf-example">
                <p className="demo-question">"El chico es inteligentes"</p>
                <div className="tf-options">
                  <button className="btn btn-danger">Hamis</button>
                  <button className="btn btn-success">Helyes</button>
                </div>
                <p className="demo-hint">⚠️ Egyes számú főnév → -e végződés</p>
              </div>
            </div>
          </div>
        );

      case "comparison":
        return (
          <div className="demo-section">
            <h2>Spanyol-Magyar melléknevek</h2>
            <div className="demo-card">
              <p>Használd helyesen a spanyol mellékneveket!</p>
              <div className="example-grid">
                <div className="example-column">
                  <h3>Példa feladat</h3>
                  <p className="demo-question">Mi a magyar megfelelője a következő szónak: alto</p>
                  <div className="answer-input">
                    <input type="text" value="magas" readOnly />
                  </div>
                </div>
                <div className="rule-block">
                  <h3>Szabályok</h3>
                  <ul>
                    <li>A spanyol melléknév mindig egyezzen a főnévvel nemben és számban</li>
                    <li>Nőnemű végződések: -a, -as, -es</li>
                    <li>Semleges végződések: -e, -ista</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case "comparison2":
        return (
          <div className="demo-section">
            <h2>Magyar-Spanyol melléknevek</h2>
            <div className="demo-card">
              <p>Használd helyesen a magyar mellékneveket!</p>
              <div className="example-grid">
                <div className="example-column">
                  <h3>Példa feladat</h3>
                  <p className="demo-question">Mi a spanyol megfelelője a következő szónak: magas</p>
                  <div className="answer-input">
                    <input type="text" value="alto" readOnly />
                  </div>
                </div>
                <div className="rule-block">
                  <h3>Szabályok</h3>
                  <ul>
                    <li>A magyar melléknév mindig egyezzen a főnévvel nemben és számban</li>
                    <li>Nőnemű végződések: -a, -as, -es</li>
                    <li>Semleges végződések: -e, -ista</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="test-demo">
      <h1>Bemutató - {
        {
          "multiple-choice": "Többszörös választásos",
          "fill-in-the-blank": "Kiegészítős feladat",
          "matching": "Párosító feladat",
          "drag-and-drop": "Átrendezős feladat",
          "true-false": "Helyes/Helytelen",
          "comparison": "Spanyol-Magyar melléknevek",
          "comparison2": "Magyar-Spanyol melléknevek"
        }[testType]
      }</h1>

      <div className="demo-content">
        {renderDemoContent()}
        <div className="general-rules">
          <h3>Általános szabályok</h3>
          <ul>
            <li>A melléknév mindig egyezzen a főnévvel nemben és számban</li>
            <li>Nőnemű végződések: -a, -as, -es (pl. bonita, grandes)</li>
            <li>Semleges végződések: -e, -ista (pl. inteligente, realista)</li>
            <li>Többes szám képzése: -s hozzáadása (pl. altos, bajas)</li>
          </ul>
        </div>
      </div>

      <div className="demo-navigation">
        <button className="start-demo-btn" onClick={startQuiz}>
          Kezdés
          <span className="arrow-icon">→</span>
        </button>
      </div>
    </div>
  );
}

export default DemoContent;
