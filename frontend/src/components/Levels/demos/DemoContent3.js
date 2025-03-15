import React from 'react';
import '../../../styles/DemoContent3.css';

function DemoContent3({ testType, startQuiz2 }) {
    const renderDemoContent = () => {
        switch (testType) {
            case "hatarozo-nevelok":
                return (
                    <div className="demo-section">
                        <h2>Nézd át alaposan a szabályokat</h2>
                        <div className="demo-card">
                            <div className="example-grid">
                                <div className="example-column">
                                    <h3>Határozó névelők</h3>
                                    <div className="table-container">
                                        <div className="table-row header-row">
                                            <div className="table-cell"></div>
                                            <div className="table-cell header-cell">Masculine</div>
                                            <div className="table-cell header-cell">Feminine</div>
                                        </div>
                                        <div className="table-row">
                                            <div className="table-cell header-cell">Singular</div>
                                            <div className="table-cell">El</div>
                                            <div className="table-cell">La</div>
                                        </div>
                                        <div className="table-row">
                                            <div className="table-cell header-cell">Plural</div>
                                            <div className="table-cell">Los</div>
                                            <div className="table-cell">Las</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="rule-block">
                                    <h3>Szabályok</h3>
                                    <ul>
                                        <li>A névelő mindig egyezzen a főnév nemével és számával.</li>
                                        <li>
                                            Példák:
                                            <br />
                                            - "El libro" (hímnem, egyes)
                                            <br />
                                            - "Las casas" (nőnem, többes)
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
                        <h2>Nézd át alaposan a szabályokat</h2>
                        <div className="demo-card">
                            <div className="example-grid">
                                <div className="example-column">
                                    <h3>Határozatlan névelők</h3>
                                    <div className="table-container">
                                        <div className="table-row header-row">
                                            <div className="table-cell"></div>
                                            <div className="table-cell header-cell">Masculine</div>
                                            <div className="table-cell header-cell">Feminine</div>
                                        </div>
                                        <div className="table-row">
                                            <div className="table-cell header-cell">Singular</div>
                                            <div className="table-cell">Un</div>
                                            <div className="table-cell">Unos</div>
                                        </div>
                                        <div className="table-row">
                                            <div className="table-cell header-cell">Plural</div>
                                            <div className="table-cell">Una</div>
                                            <div className="table-cell">Unas</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="rule-block">
                                    <h3>Szabályok</h3>
                                    <ul>
                                        <li>
                                            A határozatlan névelők a főnév neméhez és számához igazodnak:
                                            <br />
                                            - <strong>Un</strong>: hímnemű főnév, egyes szám
                                            <br />
                                            - <strong>Una</strong>: nőnemű főnév, egyes szám
                                            <br />
                                            - <strong>Unos</strong>: hímnemű főnév, többes szám
                                            <br />
                                            - <strong>Unas</strong>: nőnemű főnév, többes szám
                                        </li>
                                        <li>
                                            A határozatlan névelőt általában olyan dolgok esetén használjuk, amelyek újak, nem korábban meghatározottak.
                                        </li>
                                        <li>
                                            Ha konkrétan ismert, már említett vagy meghatározott főnévre utalunk, akkor nem határozatlan, hanem határozott névelőt használunk.
                                        </li>
                                        <li>
                                            Gyakran a névelő melléke kiegészítő jelző (melléknév), amely pontosítja a főnév minőségét, pl.: <em>un buen libro</em>.
                                        </li>
                                    </ul>
                                </div>

                            </div>
                        </div>
                    </div>

                );
            case "yo-tengo-yo-quiero":
                return (
                    <div className="demo-section">
                        <h2>Nézd át alaposan a szabályokat</h2>
                        <div className="demo-card">
                            <div className="example-grid">
                                <div className="example-column">
                                    <h3>Példák</h3>
                                    <div className="table-container">
                                        <div className="table-row">
                                            <div className="table-cell">Yo tengo</div>
                                            <div className="table-cell">I have / Nekem van</div>
                                        </div>
                                        <div className="table-row">
                                            <div className="table-cell">Yo no tengo</div>
                                            <div className="table-cell">I don’t have / Nekem nincs</div>
                                        </div>
                                        <div className="table-row">
                                            <div className="table-cell">Yo quiero</div>
                                            <div className="table-cell">I want / Szeretnék</div>
                                        </div>
                                        <div className="table-row">
                                            <div className="table-cell">Yo no quiero</div>
                                            <div className="table-cell">I don’t want / Nem szeretnék</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="rule-block">
                                    <h3>Szabályok</h3>
                                    <ul>
                                        <li>
                                            A “tener” ige kifejezi a birtoklást, míg a “querer” ige a vágyat jelöli.
                                        </li>
                                        <li>
                                            A negatív mondatokban a “no” tag használata kötelező.
                                        </li>
                                        <li>
                                            Győződj meg róla, hogy az ige megfelelően egyezik a személyes névmással.
                                        </li>
                                        <li>
                                            A fordítások során figyelj a kontextusra, mert néha az egyik ige többféleképpen is fordítható.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case "a-hay-hasznalata":
                return (
                    <div className="demo-section">
                        <h2>Nézd át alaposan a szabályokat</h2>
                        <div className="demo-card">
                            <div className="example-grid">
                                <div className="example-column">
                                    <h3>A "hay" használata</h3>
                                    <div className="table-container">
                                        <div className="table-row">
                                            <div className="table-cell">Hay</div>
                                            <div className="table-cell">There is / There are / Van / Vannak</div>
                                        </div>
                                        <div className="table-row">
                                            <div className="table-cell">No hay</div>
                                            <div className="table-cell">There isn’t / There aren’t / Nincs / Nincsenek</div>
                                        </div>
                                        <div className="table-row">
                                            <div className="table-cell">¿Hay?</div>
                                            <div className="table-cell">Is there? / Are there? / Van? / Vannak?</div>
                                        </div>
                                        <div className="table-row">
                                            <div className="table-cell">¿No hay?</div>
                                            <div className="table-cell">Isn’t there? / Aren’t there? / Nincs? / Nincsenek?</div>
                                        </div>
                                    </div>

                                </div>
                                <div className="rule-block">
                                    <h3>Szabályok</h3>
                                    <ul>
                                        <li>
                                            A "hay" kifejezi a létezést, függetlenül a főnév számától.
                                        </li>
                                        <li>
                                            A "no hay" a létezés tagadását fejezi ki, jelezve, hogy valami nem található.
                                        </li>
                                        <li>
                                            A kérdő formák, "¿Hay?" és "¿No hay?" a létezés megkérdezésére vagy a hiány megerősítésére szolgálnak.
                                        </li>
                                        <li>
                                            Az impersonal "haber" igét csak harmadik személyben használjuk, így mindig a "hay" formát alkalmazzuk.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case "alanyi-nevmasok":
                return (
                    <div className="demo-section">
                        <h2>Nézd át alaposan a szabályokat</h2>
                        <div className="demo-card">
                            <div className="example-grid">
                                <div className="example-column">
                                    <h3>Conjugation of Regular -ar Verbs: hablar</h3>
                                    <div className="table-container">
                                        <div className="table-row">
                                            <div className="table-cell">yo</div>
                                            <div className="table-cell">hablo</div>
                                            <div className="table-cell">nosotros/nosotras</div>
                                            <div className="table-cell">hablamos</div>
                                        </div>
                                        <div className="table-row">
                                            <div className="table-cell">tú</div>
                                            <div className="table-cell">hablas</div>
                                            <div className="table-cell">vosotros/vosotras</div>
                                            <div className="table-cell">habláis</div>
                                        </div>
                                        <div className="table-row">
                                            <div className="table-cell">él</div>
                                            <div className="table-cell">habla</div>
                                            <div className="table-cell">ellos</div>
                                            <div className="table-cell">hablan</div>
                                        </div>
                                        <div className="table-row">
                                            <div className="table-cell">ella</div>
                                            <div className="table-cell">habla</div>
                                            <div className="table-cell">ellas</div>
                                            <div className="table-cell">hablan</div>
                                        </div>
                                        <div className="table-row">
                                            <div className="table-cell">usted</div>
                                            <div className="table-cell">habla</div>
                                            <div className="table-cell">ustedes</div>
                                            <div className="table-cell">hablan</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="rule-block">
                                    <h3>Szabályok</h3>
                                    <ul>
                                        <li>
                                            A szabályos -ar igék esetében az ige végéről levágjuk az -ar részt, és a megfelelő személyragot tesszük a gyökérhez.
                                        </li>
                                        <li>
                                            Egyes szám: <strong>yo</strong> → -o, <strong>tú</strong> → -as, <strong>él/ella/usted</strong> → -a.
                                        </li>
                                        <li>
                                            Többes szám: <strong>nosotros/nosotras</strong> → -amos, <strong>vosotros/vosotras</strong> → -áis, <strong>ellos/ellas/ustedes</strong> → -an.
                                        </li>
                                        <li>
                                            A spanyolban a személyes névmások gyakran elhagyhatók, ha az igealak egyértelművé teszi az alanyt.
                                        </li>
                                    </ul>
                                </div>
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
            <button className="start-test-btn" onClick={startQuiz2}>
                Tovább
            </button>
        </div>
    );
}

export default DemoContent3;
