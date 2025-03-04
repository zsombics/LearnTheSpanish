import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/Levels.css';

// CSV parser: A CSV fájl soronként a következő oszlopokat tartalmazza: spanish, gender, spanishPlural, hungarian, english
function parseNounsCSV(data) {
  const lines = data.trim().split("\n");
  return lines.map(line => {
    const [spanish, gender, spanishPlural, hungarian, english] = line.split(",").map(item => item.trim());
    return { spanish, gender, spanishPlural, hungarian, english };
  });
}

function NounQuiz() {
  const navigate = useNavigate();

  // Teszt beállítás: hány kérdés, teszt típusa, stb.
  const [numQuestions, setNumQuestions] = useState(5);
  // Teszt típusa: "tobbes-szam" (többes szám képzése), "nevelok" (a névelők), "magyar-spanyol" (a főnevek neme)
  const [testType, setTestType] = useState("tobbes-szam");
  const [testStarted, setTestStarted] = useState(false);
  // Bemutató állapot: amikor a teszt elindul, először a lecke bemutatása látszik
  const [showDemo, setShowDemo] = useState(true);

  // Teszt futtatásához szükséges állapotok
  const [allNouns, setAllNouns] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // A válasz beírásához használt állapot
  const [typedAnswer, setTypedAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});

  // Teszt eredmény állapota
  const [testFinished, setTestFinished] = useState(false);
  const [result, setResult] = useState(null);

  // CSV fájl betöltése a teszt indításakor
  useEffect(() => {
    if (testStarted) {
      fetch('/nouns.csv')
        .then(response => response.text())
        .then(text => {
          const nouns = parseNounsCSV(text);
          setAllNouns(nouns);
          generateQuestions(nouns);
        })
        .catch(err => console.error("CSV betöltési hiba:", err));
    }
  }, [testStarted]);

  // Kérdések generálása a teszt típusától függően
  const generateQuestions = (nouns) => {
    const selectedQuestions = [];
    for (let i = 0; i < numQuestions; i++) {
      const randomIndex = Math.floor(Math.random() * nouns.length);
      const nounItem = nouns[randomIndex];
      let questionText = "";
      let correctAnswer = "";

      if (testType === "tobbes-szam") {
        // Többes szám képzése:
        // A kérdés megjeleníti a spanyol főnevet, illetve a magyar és angol fordítást segédként
        questionText = `Add meg a következő főnév többes számú alakját: ${nounItem.spanish} | ${nounItem.hungarian} | ${nounItem.english}`;
        correctAnswer = nounItem.spanishPlural;
      } else if (testType === "nevelok") {
        // A névelők:
        // A kérdés megjeleníti a spanyol főnevet, illetve a magyar és angol fordítást
        questionText = `Add meg a megfelelő határozott névelőt a következő főnévhez: ${nounItem.spanish} | ${nounItem.hungarian} | ${nounItem.english}`;
        correctAnswer = nounItem.gender === "masculine" ? "el" : "la";
      } else if (testType === "magyar-spanyol") {
        // A főnevek neme:
        // A kérdés megjeleníti a spanyol főnevet, illetve a magyar és angol fordítást
        questionText = `Add meg a következő főnév nemét: ${nounItem.spanish} | ${nounItem.hungarian} | ${nounItem.english}`;
        correctAnswer = nounItem.gender;
      }

      selectedQuestions.push({
        question: questionText,
        correctAnswer
      });
    }
    setQuestions(selectedQuestions);
  };

  // Teszt indítása
  const startTest = () => {
    setTestStarted(true);
    // Amikor a teszt elindul, először a bemutató jelenjen meg
    setShowDemo(true);
  };

  // A bemutató oldal elrejtése, amikor a felhasználó "Kezdés" gombra kattint
  const startQuiz = () => {
    setShowDemo(false);
  };

  // Válasz beírásának kezelése
  const handleAnswerChange = (e) => {
    setTypedAnswer(e.target.value);
  };

  // "Következő" gomb kezelése
  const handleNextQuestion = () => {
    if (typedAnswer.trim() === "") {
      alert("Kérlek, írd be a válaszodat!");
      return;
    }
    // Tároljuk a felhasználó válaszát
    setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: typedAnswer }));
    // Ellenőrizzük a válasz helyességét kis-/nagybetű érzéketlen módon
    if (typedAnswer.trim().toLowerCase() === questions[currentQuestionIndex].correctAnswer.toLowerCase()) {
      setScore(prev => prev + 1);
    }
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
      setTypedAnswer("");
      if (currentQuestionIndex === questions.length - 1) {
        finishTest();
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }, 3000);
  };

  // Teszt befejezése: eredmény elküldése és megjelenítése
  const finishTest = () => {
    const levelCalculated = score / questions.length >= 0.75 ? "Haladó"
      : score / questions.length >= 0.5 ? "Középhaladó" : "Kezdő";
    const payload = {
      answers: userAnswers,
      level: levelCalculated,
      totalQuestions: questions.length,
      correctAnswers: score,
      ratio: score / questions.length,
      quizCompleted: true
    };

    axios.post('/api/eredmenyek/submit', payload)
      .then(() => {
        setResult({ score, total: questions.length, level: levelCalculated });
        setTestFinished(true);
      })
      .catch(err => {
        console.error("Hiba a quiz mentésekor:", err);
        alert("Hiba történt a quiz mentésekor!");
      });
  };

  // Új teszt indítása
  const restartTest = () => {
    setTestStarted(false);
    setAllNouns([]);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setTypedAnswer("");
    setShowFeedback(false);
    setScore(0);
    setUserAnswers({});
    setTestFinished(false);
    setResult(null);
  };

  // Visszalépés a /kviz végpontra
  const goToKviz = () => {
    window.open("/kviz", "_self");
  };

  // Ha a teszt még nem indult el: test setup oldal
  if (!testStarted) {
    return (
      <div className="test-setup">
        <h1>Válaszd ki a teszt paramétereit</h1>
        <div className="setup-group">
          <label>Hány kérdés legyen a tesztben?</label>
          <select value={numQuestions} onChange={(e) => setNumQuestions(Number(e.target.value))}>
            {[5, 10, 15, 20, 25, 50, 100].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
        <div className="setup-group">
          <label>Teszt típusa:</label>
          <select value={testType} onChange={(e) => setTestType(e.target.value)}>
            <option value="tobbes-szam">Többes szám képzése</option>
            <option value="nevelok">A névelők</option>
            <option value="magyar-spanyol">A főnevek neme</option>
          </select>
        </div>
        <button className="start-test-btn" onClick={startTest}>Teszt indítása</button>
      </div>
    );
  }

  const renderDemoContent = () => {
    switch(testType) {
      case "tobbes-szam":
        return (
          <div className="demo-section">
            <h2>Többes szám képzése</h2>
            <div className="demo-card">
              <p>Ha egy főnév magánhangzóra végződik, akkor többesszámot a szó végére helyezett 's'-szel képezünk. Ha mássalhangzóra, akkor 'es'-szel.</p>
              <div className="example-grid">
                <div className="example-column">
                  <h3>Hímnem példák</h3>
                  <ul>
                    <li>niño → <span className="highlight">niños</span> (fiúk)</li>
                    <li>hombre → <span className="highlight">hombres</span> (férfiak)</li>
                    <li>teléfono → <span className="highlight">teléfonos</span> (telefonok)</li>
                  </ul>
                </div>
                <div className="example-column">
                  <h3>Nőnem példák</h3>
                  <ul>
                    <li>niña → <span className="highlight">niñas</span> (lányok)</li>
                    <li>mujer → <span className="highlight">mujeres</span> (nők)</li>
                    <li>casa → <span className="highlight">casas</span> (házak)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      
      case "nevelok":
        return (
          <div className="demo-section">
            <h2>A névelők</h2>
            <div className="demo-card">
              <div className="article-grid">
                <div className="article-type">
                  <h3>Határozott névelők</h3>
                  <div className="gender-columns">
                    <div>
                      <h4>Hímnem</h4>
                      <p>Egyes: <span className="highlight">el</span> (pl. el niño)</p>
                      <p>Többes: <span className="highlight">los</span> (pl. los niños)</p>
                    </div>
                    <div>
                      <h4>Nőnem</h4>
                      <p>Egyes: <span className="highlight">la</span> (pl. la niña)</p>
                      <p>Többes: <span className="highlight">las</span> (pl. las niñas)</p>
                    </div>
                  </div>
                </div>
                
                <div className="article-type">
                  <h3>Határozatlan névelők</h3>
                  <div className="gender-columns">
                    <div>
                      <h4>Hímnem</h4>
                      <p>Egyes: <span className="highlight">un</span> (pl. un niño)</p>
                    </div>
                    <div>
                      <h4>Nőnem</h4>
                      <p>Egyes: <span className="highlight">una</span> (pl. una niña)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "magyar-spanyol":
        return (
          <div className="demo-section">
            <h2>A főnevek neme</h2>
            <div className="demo-card">
              <div className="gender-rules">
                <div className="rule-block">
                  <h3>Alapszabályok</h3>
                  <ul>
                    <li>✅ <span className="highlight">-o</span> végűek: hímnem (pl. <span className="example">el niño</span>)</li>
                    <li>✅ <span className="highlight">-a</span> végűek: nőnem (pl. <span className="example">la casa</span>)</li>
                    <li>✅ <span className="highlight">-dad/-tad/-ción</span> végűek: nőnem (pl. <span className="example">la ciudad</span>)</li>
                  </ul>
                </div>

                <div className="rule-block">
                  <h3>Kivételek és speciális esetek</h3>
                  <ul>
                    <li>🚩 <span className="highlight">-ma</span> végűek: hímnem (pl. <span className="example">el problema</span>)</li>
                    <li>🚩 <span className="highlight">-ista/-ante</span> végűek: mindkét nem (pl. <span className="example">el/la turista</span>)</li>
                    <li>🚩 Kettős névelős esetek: <span className="example">el agua</span> (nőnem, de 'el' névelővel)</li>
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

  if (showDemo) {
    return (
      <div className="test-demo">
        <h1>Bemutató - {{
          "tobbes-szam": "Többes szám képzése",
          "nevelok": "A névelők",
          "magyar-spanyol": "A főnevek neme"
        }[testType]}</h1>
        
        <div className="demo-content">
          {renderDemoContent()}
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

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="test-page">
      <div className="question-card">
        <h2 className="question-text">{currentQuestion.question}</h2>
        <div className="answer-input">
          <input
            type="text"
            placeholder="Írd be a válaszodat..."
            value={typedAnswer}
            onChange={handleAnswerChange}
          />
        </div>
        {showFeedback && (
          <div className="feedback">
            {typedAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.toLowerCase() ? (
              <p className="correct-feedback">Helyes válasz!</p>
            ) : (
              <p className="incorrect-feedback">
                Hibás válasz! A helyes válasz: <span className="correct-answer">{currentQuestion.correctAnswer}</span>
              </p>
            )}
          </div>
        )}
      </div>
      <div className="quiz-navigation">
        {currentQuestionIndex < questions.length - 1 ? (
          <button className="nav-btn" onClick={handleNextQuestion}>Következő</button>
        ) : (
          <button className="nav-btn" onClick={finishTest}>Befejezés</button>
        )}
      </div>
    </div>
  );
}

export default NounQuiz;
