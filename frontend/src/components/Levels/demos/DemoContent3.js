import React from 'react';
import '../../../styles/Levels.css';

function DemoContent3({ testType }) {
    const renderDemoContent = () => {
        switch (testType) {
            case "hatarozo-nevelok":
                return (
                    <div className="demo-section">
                        <h2>Többszörös választásos teszt</h2>
                        <div className="demo-card">
                            <p>Válaszd ki a helyes névelőt a főnév szerinti nemhez és számhoz!</p>
                            <div className="example-grid">
                                <div className="example-column">
                                    <h3>Példa táblázat</h3>
                                    <div className="table-container">
                                        {/* JAVÍTOTT FEJLÉC */}
                                        <div className="table-row header-row">
                                            <div className="table-cell header-cell">NEM</div>
                                            <div className="table-cell header-cell">SINGULAR</div>
                                            <div className="table-cell header-cell">PLURAL</div>
                                        </div>

                                        {/* MASCULINE SOR */}
                                        <div className="table-row">
                                            <div className="table-cell">MASCULINE</div>
                                            <div className="table-cell">el</div>
                                            <div className="table-cell">los</div>
                                        </div>

                                        {/* FEMININE SOR */}
                                        <div className="table-row">
                                            <div className="table-cell">FEMININE</div>
                                            <div className="table-cell">la</div>
                                            <div className="table-cell">las</div>
                                        </div>
                                    </div>
                                </div>

                                {/* SZABÁLYBLOKK */}
                                <div className="rule-block">
                                    <h3>Szabályok</h3>
                                    <ul>
                                        <li>A névelő mindig egyezzen a főnévvel</li>
                                        <li>Példák:
                                            <br />- "el libro" (hímnem, egyes)
                                            <br />- "las casas" (nőnem, többes)
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case "hatarozatlan-nevelok":
                return (
                    <div className="demo-section">
                        <h2>Többszörös választásos teszt</h2>
                        <div className="demo-card">
                            <p>Válaszd ki a helyes melléknév alakot a megadott lehetőségek közül!</p>
                            <div className="example-grid">
                                <div className="example-column">
                                    <h3>Példa feladat</h3>
                                    <div className="table-container">
                                        <div className="table-row header-row">
                                            <div className="table-cell header-cell">SINGULAR</div>
                                            <div className="table-cell header-cell">PLURAL</div>
                                        </div>
                                        <div className="table-row">
                                            <div className="table-cell">MASCULINE</div>
                                            <div className="table-cell">el</div>
                                            <div className="table-cell">los</div>
                                        </div>
                                        <div className="table-row">
                                            <div className="table-cell">FEMININE</div>
                                            <div className="table-cell">la</div>
                                            <div className="table-cell">las</div>
                                        </div>
                                    </div>
                                    <p className="demo-hint">⚠️ Figyelj a főnév nemére és számára!</p>
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
            case "yo-tengo-yo-quiero":
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
            case "a-hay-hasznalata":
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
            case "alanyi-nevmasok":
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
            case "osszegzo-1":
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
            <div className="demo-content">
                {renderDemoContent()}
            </div>
        </div>
    );
}

export default DemoContent3;
