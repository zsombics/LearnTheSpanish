import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Levels.css';
import MultipleChoiceQuiz from '../../../Levels/quizTypes/MultipleChoiceQuiz';

function parseNounsCSV(data) {
    const lines = data.trim().split("\n");
    return lines.filter(line => line.trim() !== '').map(line => {
        const parts = line.split(",").map(item => item.trim());
        if (parts.length >= 5) {
            const [spanish, gender, spanishPlural, hungarian, english] = parts;
            return { spanish, gender, spanishPlural, hungarian, english };
        }
        console.warn("Skipping invalid CSV line:", line);
        return null;
    }).filter(item => item !== null);
}

const CITY_ID = 2;
const LEVEL_NAME = 'Level2';

function NounQuiz() {
    const [numQuestions, setNumQuestions] = useState(5);
    const [testType, setTestType] = useState("tobbes-szam");
    const [testStarted, setTestStarted] = useState(false);
    const [showDemo, setShowDemo] = useState(true);
    const [allNouns, setAllNouns] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [typedAnswer, setTypedAnswer] = useState("");
    const [showFeedback, setShowFeedback] = useState(false);
    const [userAnswers, setUserAnswers] = useState({});
    const [testFinished, setTestFinished] = useState(false);
    const [result, setResult] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        if (testStarted && allNouns.length === 0) {
            fetch('/nouns.csv')
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(text => {
                    const nouns = parseNounsCSV(text);
                    if (nouns && nouns.length > 0) {
                        setAllNouns(nouns);
                        generateQuestions(nouns);
                    } else {
                         console.error("No valid nouns parsed from CSV.");
                         alert("Hiba: Nem sikerült feldolgozni a szavakat tartalmazó fájlt.");
                         setTestStarted(false);
                    }
                })
                .catch(err => {
                    console.error("CSV betöltési vagy feldolgozási hiba:", err);
                    alert("Hiba történt a szavak betöltése közben. Kérlek, próbáld újra később.");
                    setTestStarted(false);
                });
        }
    }, [testStarted, allNouns.length]);

    const generateQuestions = (nouns) => {
        if (!nouns || nouns.length === 0) {
            console.error("Cannot generate questions: Nouns data is missing or empty.");
            alert("Hiba: Nincsenek szavak a teszt generálásához.");
            setTestStarted(false);
            return;
        }

        const selectedQuestions = [];
        const availableIndices = Array.from(nouns.keys());
        const actualNumQuestions = Math.min(numQuestions, availableIndices.length);

        if (numQuestions > availableIndices.length) {
            console.warn(`Requested ${numQuestions} questions, but only ${availableIndices.length} unique nouns available. Using ${availableIndices.length}.`);
        }

        for (let i = 0; i < actualNumQuestions; i++) {
             if (availableIndices.length === 0) break;

            const randomIndexInAvailable = Math.floor(Math.random() * availableIndices.length);
            const nounIndex = availableIndices.splice(randomIndexInAvailable, 1)[0];
            const nounItem = nouns[nounIndex];

            if (!nounItem) {
                console.warn(`Skipping question generation for invalid noun at index ${nounIndex}`);
                i--;
                continue;
            }

            let questionText = "";
            let correctAnswer = "";
            let options = [];
            const spanish = nounItem.spanish || '';
            const hungarian = nounItem.hungarian || '';
            const english = nounItem.english || '';
            const spanishPlural = nounItem.spanishPlural || '';
            const gender = nounItem.gender || '';

            if (testType === "tobbes-szam") {
                questionText = `Add meg a következő főnév többes számú alakját: ${spanish} | ${hungarian} | ${english}`;
                correctAnswer = spanishPlural;
            } else if (testType === "nevelok") {
                questionText = `Add meg a megfelelő határozott névelőt a következő főnévhez: ${spanish} | ${hungarian} | ${english}`;
                correctAnswer = gender === "masculine" ? "el" : (gender === "feminine" ? "la" : "");
                options = ["el", "la"];
            } else if (testType === "magyar-spanyol") {
                questionText = `Add meg a következő főnév nemét: ${spanish} | ${hungarian} | ${english}`;
                correctAnswer = gender;
                options = ["masculine", "feminine"];
            }

            if (correctAnswer) {
                 selectedQuestions.push({
                    question: questionText,
                    correctAnswer,
                    options,
                    nounData: nounItem
                });
            } else {
                 console.warn(`Skipping question for "${spanish}" due to missing correct answer for type "${testType}".`);
                 i--;
            }
        }

         if (selectedQuestions.length === 0 && actualNumQuestions > 0) {
             console.error("Failed to generate any valid questions.");
             alert("Hiba: Nem sikerült egyetlen érvényes kérdést sem generálni.");
             setTestStarted(false);
             return;
        }

        setQuestions(selectedQuestions);
        setCurrentQuestionIndex(0);
        setUserAnswers({});
        setTypedAnswer("");
        setShowFeedback(false);
        setTestFinished(false);
        setResult(null);
    };

    const startTest = () => {
        setTestStarted(true);
        setShowDemo(true);
    };

    const startQuiz = () => {
         if (questions.length > 0) {
           setShowDemo(false);
        } else {
            console.log("Waiting for questions to load...");
        }
    };

    const handleAnswerChange = (e) => {
        setTypedAnswer(e.target.value);
    };

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };

    const handleNextQuestion = () => {
        if (testType === "tobbes-szam") {
            if (typedAnswer.trim() === "") {
                alert("Kérlek, írd be a válaszodat!");
                return;
            }

            const updatedAnswers = {
                ...userAnswers,
                [currentQuestionIndex]: typedAnswer.trim()
            };

            setUserAnswers(updatedAnswers);
            setShowFeedback(true);

            setTimeout(() => {
                setShowFeedback(false);
                setTypedAnswer("");

                if (currentQuestionIndex === questions.length - 1) {
                    finishTest(updatedAnswers);
                } else {
                    setCurrentQuestionIndex(prev => prev + 1);
                }
            }, 2000);
        } else {
            if (!selectedOption) {
                alert("Kérlek, válassz egy választ!");
                return;
            }

            const updatedAnswers = {
                ...userAnswers,
                [currentQuestionIndex]: selectedOption
            };

            setUserAnswers(updatedAnswers);
            setShowFeedback(true);

            setTimeout(() => {
                setShowFeedback(false);
                setSelectedOption(null);

                if (currentQuestionIndex === questions.length - 1) {
                    finishTest(updatedAnswers);
                } else {
                    setCurrentQuestionIndex(prev => prev + 1);
                }
            }, 2000);
        }
    };

    const finishTest = (finalUserAnswers) => {
        if (!questions || questions.length === 0) {
            console.error("Cannot finish test: Questions data is missing.");
            alert("Hiba történt a teszt befejezésekor (hiányzó kérdések).");
            return;
        }

        let finalScore = 0;
        questions.forEach((question, index) => {
            const userAnswer = finalUserAnswers[index];
            if (userAnswer && userAnswer.toLowerCase() === question.correctAnswer.toLowerCase()) {
                finalScore++;
            }
        });

        const ratio = questions.length > 0 ? finalScore / questions.length : 0;
        const levelCalculated = ratio >= 0.75 ? "Haladó"
                             : ratio >= 0.5 ? "Középhaladó"
                             : "Kezdő";

        const payload = {
            answers: finalUserAnswers,
            level: LEVEL_NAME,
            cityId: CITY_ID,
            totalQuestions: questions.length,
            correctAnswers: finalScore,
            ratio: ratio,
            quizCompleted: true,
            testType: testType,
        };

        console.log("Submitting results:", payload);

        axios.post('/api/eredmenyek/submit', payload)
            .then(response => {
                console.log("Quiz results submitted successfully:", response.data);
                setResult({ score: finalScore, total: questions.length, level: levelCalculated });
                setTestFinished(true);
            })
            .catch(err => {
                console.error("Hiba a quiz mentésekor:", err.response ? err.response.data : err.message);
                alert(`Hiba történt a quiz eredményeinek mentésekor: ${err.response ? err.response.data.message || err.message : err.message}. Az eredményeid helyben megjelennek.`);
                 setResult({ score: finalScore, total: questions.length, level: levelCalculated });
                 setTestFinished(true);
            });
    };

    const restartTest = () => {
        setTestStarted(false);
        setAllNouns([]);
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setTypedAnswer("");
        setShowFeedback(false);
        setUserAnswers({});
        setTestFinished(false);
        setResult(null);
        setShowDemo(true);
    };

    const goToKviz = () => {
        window.location.href = "/kviz";
    };

    if (!testStarted) {
        return (
            <div className="test-setup">
                <h1>Válaszd ki a teszt paramétereit</h1>
                <div className="setup-group">
                    <label htmlFor="num-questions-select">Hány kérdés legyen a tesztben?</label>
                    <select id="num-questions-select" value={numQuestions} onChange={(e) => setNumQuestions(Number(e.target.value))}>
                        {[5, 10, 15, 20, 25, 50, 100].map(num => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                </div>
                <div className="setup-group">
                    <label htmlFor="test-type-select">Teszt típusa:</label>
                    <select id="test-type-select" value={testType} onChange={(e) => setTestType(e.target.value)}>
                        <option value="tobbes-szam">Többes szám képzése</option>
                        <option value="nevelok">A névelők (el/la)</option>
                        <option value="magyar-spanyol">A főnevek neme (masculine/feminine)</option>
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
                        <li>profesor → <span className="highlight">profesores</span> (tanárok)</li>
                      </ul>
                    </div>
                    <div className="example-column">
                      <h3>Nőnem példák</h3>
                      <ul>
                        <li>niña → <span className="highlight">niñas</span> (lányok)</li>
                        <li>mujer → <span className="highlight">mujeres</span> (nők)</li>
                        <li>casa → <span className="highlight">casas</span> (házak)</li>
                        <li>ciudad → <span className="highlight">ciudades</span> (városok)</li>
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
                      <p className='note'>Figyelem: 'a' vagy 'ha' hanggal kezdődő nőnemű szavaknál <span className="highlight">el</span> névelőt használunk (pl. <span className="example">el agua</span>), de a melléknév nőnemű marad (<span className="example">el agua fría</span>). Többesszámban visszavált: <span className="example">las aguas</span>.</p>
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
                        <li>✅ <span className="highlight">-o</span> végűek: hímnem (pl. <span className="example">el niño</span>, <span className="example">el libro</span>)</li>
                        <li>✅ <span className="highlight">-a</span> végűek: nőnem (pl. <span className="example">la casa</span>, <span className="example">la mesa</span>)</li>
                        <li>✅ <span className="highlight">-dad/-tad/-ción</span> végűek: nőnem (pl. <span className="example">la ciudad</span>, <span className="example">la canción</span>)</li>
                      </ul>
                    </div>

                    <div className="rule-block">
                      <h3>Kivételek és speciális esetek</h3>
                      <ul>
                        <li>🚩 <span className="highlight">-ma</span> végűek: hímnem (pl. <span className="example">el problema</span>)</li>
                        <li>🚩 <span className="highlight">-ista/-ante</span> végűek: mindkét nem (pl. <span className="example">el/la turista</span>, <span className="example">el/la estudiante</span>)</li>
                        <li>🚩 Kettős névelős esetek: <span className="example">el agua</span> (nőnem, de 'el' névelővel)</li>
                      </ul>
                       <p className='note'>A nemeket meg kell tanulni a szavakkal együtt!</p>
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
        if (allNouns.length === 0 && testStarted) {
             return <div >Adatok betöltése...</div>;
        }
         if (questions.length === 0 && allNouns.length > 0) {
             return <div >Kérdések generálása...</div>;
         }

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
    if (!currentQuestion) {
         return <div>Hiba történt a kérdés betöltésekor. <button onClick={restartTest}>Újrapróbálkozás</button></div>;
    }

    if (testType === "nevelok" || testType === "magyar-spanyol") {
        return (
            <div className="test-page">
                <MultipleChoiceQuiz
                    currentQuestion={currentQuestion}
                    selectedOption={selectedOption}
                    handleOptionSelect={handleOptionSelect}
                    showFeedback={showFeedback}
                />
                <div className="quiz-navigation">
                    <button
                        className="nav-btn"
                        onClick={handleNextQuestion}
                        disabled={showFeedback}
                    >
                        {currentQuestionIndex < questions.length - 1 ? 'Következő' : 'Befejezés'}
                    </button>
                </div>
            </div>
        );
    }

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
                        autoFocus
                        onKeyPress={(event) => {
                            if (event.key === 'Enter') {
                                handleNextQuestion();
                            }
                        }}
                        disabled={showFeedback}
                    />
                </div>
                {showFeedback && (
                    <div className={`feedback ${typedAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.toLowerCase() ? 'correct-feedback' : 'incorrect-feedback'}`}>
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
                <button
                    className="nav-btn"
                    onClick={handleNextQuestion}
                    disabled={showFeedback}
                >
                    {currentQuestionIndex < questions.length - 1 ? 'Következő' : 'Befejezés'}
                </button>
            </div>
        </div>
    );
}

export default NounQuiz;
