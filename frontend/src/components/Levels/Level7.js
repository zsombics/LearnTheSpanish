import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'D:/LearnTheSpanish/frontend/src/styles/Levels.css';

function Level7() {
    const [testStarted, setTestStarted] = useState(false);
    const [direction, setDirection] = useState('');
    const [questions, setQuestions] = useState([]);
    const [testFinished, setTestFinished] = useState(false);
    const [result, setResult] = useState(null);

    const goToKviz = () => window.open("/kviz", "_self");
    const startTest = () => setTestStarted(true);
    const restartTest = () => {
        setTestStarted(false);
        setTestFinished(false);
        setResult(null);
    };

    if (!testStarted) {
        return (
            <div className="test-setup">
                <h1>Válaszd ki a teszt paramétereit</h1>
                <div className="setup-group">
                    <label>Teszt iránya:</label>
                    <select value={direction} onChange={(e) => setDirection(e.target.value)}>
                        <option value="hatarozo-nevelok">Határozó névelők · Család</option>
                        <option value="hatarozatlan-nevelok">Határozatlan névelők · A ház körül</option>
                        <option value="yo-tengo-yo-quiero">Yo tengo és yo quiero · Állatok</option>
                        <option value="a-hay-hasznalata">A "hay" használata · Az osztályterem</option>
                        <option value="alanyi-nevmasok">Alanyi névmások · Gyakori -ar igék · Szabályos -ar igék · A hét napjai</option>
                        <option value="osszegzo-1">Összegző 1 · Leckék 1–5</option>
                    </select>
                </div>
                <button className="start-test-btn" onClick={startTest}>Teszt indítása</button>
            </div>
        );
    }

    if (questions.length === 0) return <div>Betöltés...</div>;

    if (testFinished && result) {
        return (
            <div className="test-results">
                <h1>Eredmény</h1>
                <p>{result.score} helyes válasz a {result.total} kérdésből.</p>
                <p>Szint: {result.level}</p>
                <div className="results-navigation">
                    <button className="result-btn" onClick={restartTest}>Új teszt</button>
                    <button className="result-btn secondary" onClick={goToKviz}>Vissza a Kvízhez</button>
                </div>
            </div>
        );
    }

    return null; // Add a return statement for the default case
}

export default Level7;
