import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/Levels.css';

import MultipleChoiceQuiz from './quizTypes/MultipleChoiceQuiz';
import FillInTheBlankQuiz from './quizTypes/FillTheBlankV2';
import MatchingQuiz from './quizTypes/MatchingQuiz';
import DragAndDropQuiz from './quizTypes/DragAndDropQuiz';
import TrueFalseQuiz from './quizTypes/TrueFalseQuiz';
import DemoContent from './demos/DemoContent';

function parseAdjectivesCSV(data) {
  const lines = data.trim().split("\n");
  return lines.filter(line => line.trim() !== '').map(line => {
    const parts = line.split(",").map(item => item.trim());
    if (parts.length >= 3) {
        const [spanish, english, hungarian] = parts;
        return { spanish, english, hungarian };
    }
    console.warn("Skipping invalid adjective CSV line:", line);
    return null;
  }).filter(item => item !== null);
}

function parseMultipleChoiceCSV(data) {
  const lines = data.trim().split("\n");
  return lines.filter(line => line.trim() !== '').map(line => {
    const parts = line.split(",").map(item => item.trim());
     if (parts.length >= 2) {
        return {
          question: parts[0],
          options: parts.slice(1)
        };
    }
    console.warn("Skipping invalid multiple choice CSV line:", line);
    return null;
  }).filter(item => item !== null);
}

function parseDragAndDropCSV(data) {
  const lines = data.trim().split("\n");
  return lines.map(line => line.trim()).filter(line => line !== '');
}

function parseUsageCSV(data) {
  const lines = data.trim().split("\n");
  return lines.filter(line => line.trim() !== '').map(line => {
    const parts = line.split(",").map(item => item.trim());
    if (parts.length >= 4) {
        const [category, sentence, correctness, explanation] = parts;
        const validCorrectness = ["Helyes", "Helytelen"].includes(correctness);
        if (!validCorrectness) {
            console.warn(`Invalid correctness value "${correctness}" in usage CSV line:`, line);
            return null;
        }
        return { category, sentence, correctAnswer: correctness, explanation };
    }
    console.warn("Skipping invalid usage CSV line:", line);
    return null;
  }).filter(item => item !== null);
}

function parseMatchingAdjectivesCSV(data) {
  const lines = data.trim().split("\n");
  return lines.filter(line => line.trim() !== '').map(line => {
    const parts = line.split(",").map(item => item.trim());
     if (parts.length >= 3) {
        const [spanish, english, hungarian] = parts;
        return { spanish, english, hungarian };
    }
    console.warn("Skipping invalid matching adjective CSV line:", line);
    return null;
  }).filter(item => item !== null);
}

function AdjectiveQuiz() {
  const navigate = useNavigate();

  const [numQuestions, setNumQuestions] = useState(5);
  const [testType, setTestType] = useState("multiple-choice");
  const [testStarted, setTestStarted] = useState(false);
  const [showDemo, setShowDemo] = useState(true);

  const [allItems, setAllItems] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});

  const [testFinished, setTestFinished] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (testStarted && allItems.length === 0) {
      let fileToFetch;
      let parserFunction;
      let questionGenerator;

      switch(testType) {
        case "true-false":
          fileToFetch = '/spanish_adjective_usage_500_unique.csv';
          parserFunction = parseUsageCSV;
          questionGenerator = generateQuestionsUsage;
          break;
        case "multiple-choice":
          fileToFetch = '/MultipleChoiceQuiz.csv';
          parserFunction = parseMultipleChoiceCSV;
          questionGenerator = generateMultipleChoiceQuestions;
          break;
        case "fill-in-the-blank":
        case "matching":
        case "comparison":
        case "comparison2":
          axios.get('/api/adjectives')
            .then(response => {
              const items = response.data;
              if (items && items.length > 0) {
                setAllItems(items);
                switch(testType) {
                  case "fill-in-the-blank":
                  case "comparison":
                  case "comparison2":
                    generateQuestions(items);
                    break;
                  case "matching":
                    generateMatchingQuestions(items);
                    break;
                  default:
                    console.error("Unknown test type for adjectives:", testType);
                    alert("Ismeretlen teszt típus!");
                    restartTest();
                }
              } else {
                console.error("No valid items received from adjectives API");
                alert("Hiba: Nem sikerült elemeket feldolgozni az adatbázisból.");
                restartTest();
              }
            })
            .catch(err => {
              console.error("Database loading error:", err);
              alert("Hiba történt az adatbázis betöltése közben.");
              restartTest();
            });
          return;
        case "drag-and-drop":
          fileToFetch = '/DragAndDropQuiz.csv';
          parserFunction = parseDragAndDropCSV;
          questionGenerator = generateDragAndDropQuestions;
          break;
        default:
          console.error("Unknown test type selected:", testType);
          alert("Ismeretlen teszt típus!");
          setTestStarted(false);
          return;
      }

      if (fileToFetch) {
        fetch(fileToFetch)
          .then(response => {
              if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status} fetching ${fileToFetch}`);
              }
              return response.text();
          })
          .then(text => {
            const items = parserFunction(text);
            if (items && items.length > 0) {
              setAllItems(items);
              questionGenerator(items);
            } else {
              console.error(`No valid items parsed from ${fileToFetch} for test type ${testType}.`);
              alert(`Hiba: Nem sikerült ${testType === 'drag-and-drop' ? 'mondatokat' : 'elemeket'} feldolgozni a fájlból.`);
              restartTest();
            }
          })
          .catch(err => {
              console.error("CSV loading or parsing error:", err);
              alert(`Hiba történt a ${fileToFetch} betöltése vagy feldolgozása közben.`);
              restartTest();
          });
      }
    }
  }, [testStarted, testType, numQuestions, allItems.length]);

  const generateMultipleChoiceQuestions = (items) => {
     if (!items || items.length === 0) return;
     const selectedQuestions = [];
     const shuffledItems = [...items].sort(() => Math.random() - 0.5);
     const actualNumQuestions = Math.min(numQuestions, shuffledItems.length);

     for (let i = 0; i < actualNumQuestions; i++) {
         const item = shuffledItems[i];
         if (!item || !item.question || !item.options) {
             console.warn("Skipping invalid multiple choice item:", item);
             continue;
         }
         const correctAnswer = item.options[0];
         let options = [...item.options];
         options = options.sort(() => Math.random() - 0.5);

         selectedQuestions.push({
             question: item.question,
             correctAnswer: correctAnswer,
             options: options
         });
     }
     if (selectedQuestions.length < actualNumQuestions) {
         console.warn(`Could only generate ${selectedQuestions.length} multiple choice questions out of ${actualNumQuestions} requested.`);
     }
     if (selectedQuestions.length === 0) {
        console.error("Failed to generate any multiple choice questions.");
        alert("Hiba: Nem sikerült többszörös választásos kérdéseket generálni.");
        restartTest();
        return;
     }
     setQuestions(selectedQuestions);
 };

  const generateDragAndDropQuestions = (sentences) => {
    if (!sentences || sentences.length === 0) return;
    const selectedQuestions = [];
    const shuffledSentences = [...sentences].sort(() => Math.random() - 0.5);
    const actualNumQuestions = Math.min(numQuestions, shuffledSentences.length);

    for (let i = 0; i < actualNumQuestions; i++) {
        const sentence = shuffledSentences[i];
        if (!sentence || typeof sentence !== 'string' || sentence.split(" ").length < 2) {
            console.warn("Skipping invalid sentence for drag-and-drop:", sentence);
            continue;
        }
        const words = sentence.split(" ");
        let shuffledWords;
        let attempts = 0;
        do {
            shuffledWords = [...words].sort(() => Math.random() - 0.5);
            attempts++;
        } while (shuffledWords.join(" ") === sentence && attempts < 10);

        const questionText = `Rendezd sorba a szavakat, hogy helyes legyen a mondat: ${shuffledWords.join(" ")}`;
        selectedQuestions.push({
            question: questionText,
            words: words,
            shuffledWords: shuffledWords,
            correctAnswer: sentence
        });
    }
     if (selectedQuestions.length === 0) {
        console.error("Failed to generate any drag and drop questions.");
        alert("Hiba: Nem sikerült átrendezős kérdéseket generálni.");
        restartTest();
        return;
     }
    setQuestions(selectedQuestions);
  };

 const generateMatchingQuestions = (items) => {
    if (!items || items.length === 0) return;
    const selectedQuestions = [];
    const allHungarian = items.map(item => item.hungarian).filter(Boolean);
    const uniqueHungarian = [...new Set(allHungarian)];
    const shuffledItems = [...items].sort(() => Math.random() - 0.5);
    const actualNumQuestions = Math.min(numQuestions, shuffledItems.length);

    for (let i = 0; i < actualNumQuestions; i++) {
        const item = shuffledItems[i];
        if (!item || !item.spanish || !item.hungarian) {
            console.warn("Skipping invalid item for matching:", item);
            continue;
        }
        const questionText = `Párosítsd: Mi a magyar jelentése a melléknévnek: ${item.spanish} ?`;
        const correctAnswer = item.hungarian;

        let distractors = uniqueHungarian.filter(hung => hung !== correctAnswer).sort(() => Math.random() - 0.5).slice(0, 3);

         let options = [correctAnswer, ...distractors];
         options = [...new Set(options)];

         while (options.length < 4) {
             options.push(`Opció ${options.length + 1}`);
         }
         options = options.slice(0,4);

        selectedQuestions.push({
            question: questionText,
            correctAnswer,
            options: options.sort(() => Math.random() - 0.5)
        });
    }
     if (selectedQuestions.length === 0) {
        console.error("Failed to generate any matching questions.");
        alert("Hiba: Nem sikerült párosító kérdéseket generálni.");
        restartTest();
        return;
     }
    setQuestions(selectedQuestions);
 };

  const generateQuestions = (adjectives) => {
    if (!adjectives || adjectives.length === 0) return;
    const selectedQuestions = [];
    const shuffledAdjectives = [...adjectives].sort(() => Math.random() - 0.5);
    const actualNumQuestions = Math.min(numQuestions, shuffledAdjectives.length);

    for (let i = 0; i < actualNumQuestions; i++) {
        const adjItem = shuffledAdjectives[i];
        if (!adjItem) continue;

        let questionText = "";
        let correctAnswer = "";

        switch (testType) {
            case "fill-in-the-blank":
                questionText = `Mi a spanyol megfelelője: ${adjItem.english} / ${adjItem.hungarian}?`;
                correctAnswer = adjItem.spanish;
                if (!adjItem.spanish || !adjItem.english || !adjItem.hungarian) {
                    console.warn("Skipping fill-in-the-blank due to missing data:", adjItem);
                    continue;
                }
                break;
            case "comparison":
                questionText = `Mi a magyar megfelelője: ${adjItem.spanish}?`;
                correctAnswer = adjItem.hungarian;
                 if (!adjItem.spanish || !adjItem.hungarian) {
                    console.warn("Skipping comparison due to missing data:", adjItem);
                    continue;
                }
                break;
            case "comparison2":
                questionText = `Mi a spanyol megfelelője: ${adjItem.hungarian}?`;
                correctAnswer = adjItem.spanish;
                 if (!adjItem.spanish || !adjItem.hungarian) {
                    console.warn("Skipping comparison2 due to missing data:", adjItem);
                    continue;
                }
                break;
            default:
                console.warn("generateQuestions called with unexpected testType:", testType);
                continue;
        }

        selectedQuestions.push({
            question: questionText,
            correctAnswer,
            options: []
        });
    }
     if (selectedQuestions.length === 0) {
        console.error(`Failed to generate any questions for type ${testType}.`);
        alert(`Hiba: Nem sikerült "${testType}" típusú kérdéseket generálni.`);
        restartTest();
        return;
     }
    setQuestions(selectedQuestions);
  };

  const generateQuestionsUsage = (usageItems) => {
     if (!usageItems || usageItems.length === 0) return;
     const selectedQuestions = [];
     const shuffledItems = [...usageItems].sort(() => Math.random() - 0.5);
     const actualNumQuestions = Math.min(numQuestions, shuffledItems.length);

    for (let i = 0; i < actualNumQuestions; i++) {
        const usageItem = shuffledItems[i];
        if (!usageItem || !usageItem.sentence || !usageItem.correctAnswer) {
            console.warn("Skipping invalid usage item:", usageItem);
            continue;
        }
        const questionText = usageItem.sentence;
        const correctAnswer = usageItem.correctAnswer;

        selectedQuestions.push({
            question: questionText,
            correctAnswer,
            options: ["Helyes", "Helytelen"].sort(() => Math.random() - 0.5),
            explanation: usageItem.explanation || ""
        });
    }
     if (selectedQuestions.length === 0) {
        console.error("Failed to generate any true/false questions.");
        alert("Hiba: Nem sikerült Helyes/Helytelen kérdéseket generálni.");
        restartTest();
        return;
     }
    setQuestions(selectedQuestions);
  };

  const startTest = () => {
    setAllItems([]);
    setQuestions([]);
    setTestStarted(true);
    setShowDemo(true);
     setCurrentQuestionIndex(0);
     setTypedAnswer("");
     setSelectedOption("");
     setShowFeedback(false);
     setUserAnswers({});
     setTestFinished(false);
     setResult(null);
  };

  const startQuiz = () => {
     if (questions.length > 0) {
        setShowDemo(false);
     } else {
        console.log("Waiting for questions to load before starting quiz...");
     }
  };

  const handleAnswerChange = (e) => {
    setTypedAnswer(e.target.value);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    const isManual = ["fill-in-the-blank", "drag-and-drop", "comparison", "comparison2"].includes(testType);
    const userResponse = isManual ? typedAnswer.trim() : selectedOption;

    if (!userResponse) {
      alert("Kérlek, add meg a válaszodat!");
      return;
    }

    const currentAnswer = userResponse;

    const updatedAnswers = {
      ...userAnswers,
      [currentQuestionIndex]: currentAnswer
    };

    setUserAnswers(updatedAnswers);

    let isCorrect = false;
    const correctAnswer = questions[currentQuestionIndex].correctAnswer;

    if (typeof correctAnswer === 'string') {
        isCorrect = currentAnswer.toLowerCase() === correctAnswer.toLowerCase();
    } else {
         isCorrect = currentAnswer === correctAnswer;
    }

    setShowFeedback(true);

    setTimeout(() => {
      setShowFeedback(false);
      setTypedAnswer("");
      setSelectedOption("");

      if (currentQuestionIndex === questions.length - 1) {
        finishTest(updatedAnswers);
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }, 2000);
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
        const correctAnswer = question.correctAnswer;

        if (userAnswer) {
             if (typeof userAnswer === 'string' && typeof correctAnswer === 'string') {
                 if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
                     finalScore++;
                 }
             } else if (userAnswer === correctAnswer) {
                 finalScore++;
             }
        }
    });

    const ratio = questions.length > 0 ? finalScore / questions.length : 0;
    const levelCalculated = ratio >= 0.75 ? "Haladó"
                         : ratio >= 0.5 ? "Középhaladó"
                         : "Kezdő";

    const payload = {
      answers: finalUserAnswers,
      level: levelCalculated,
      totalQuestions: questions.length,
      correctAnswers: finalScore,
      ratio: ratio,
      quizCompleted: true,
      testType: testType
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
    setAllItems([]);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setTypedAnswer("");
    setSelectedOption("");
    setShowFeedback(false);
    setUserAnswers({});
    setTestFinished(false);
    setResult(null);
    setShowDemo(true);
  };

  const goToKviz = () => {
    navigate("/kviz");
  };

  if (!testStarted) {
    return (
      <div className="test-setup">
        <h1>Válaszd ki a teszt paramétereit</h1>
        <div className="setup-group">
          <label htmlFor="num-questions-select-adj">Hány kérdés legyen a tesztben?</label>
          <select id="num-questions-select-adj" value={numQuestions} onChange={(e) => setNumQuestions(Number(e.target.value))}>
            {[2, 5, 10, 15, 20, 25, 50, 100].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
        <div className="setup-group">
          <label htmlFor="test-type-select-adj">Teszt típusa:</label>
          <select id="test-type-select-adj" value={testType} onChange={(e) => setTestType(e.target.value)}>
            <option value="multiple-choice">Többszörös választásos</option>
            <option value="fill-in-the-blank">Kiegészítős feladat (Fordítás)</option>
            <option value="matching">Párosító feladat (Spanyol-Magyar)</option>
            <option value="drag-and-drop">Átrendezős feladat (Mondatok)</option>
            <option value="true-false">Helyes/Helytelen (Használat)</option>
            <option value="comparison">Spanyol-Magyar melléknevek</option>
            <option value="comparison2">Magyar-Spanyol melléknevek</option>
          </select>
        </div>
        <button className="start-test-btn" onClick={startTest}>Teszt indítása</button>
      </div>
    );
  }

  if (showDemo) {
     if (allItems.length === 0 && testStarted) {
         return <div className="test-demo">Adatok betöltése...</div>;
     }
      if (questions.length === 0 && allItems.length > 0) {
         return <div className="test-demo">Kérdések generálása...</div>;
     }
    return (
      <DemoContent testType={testType} startQuiz={startQuiz} restartTest={restartTest} />
    );
  }

  if (questions.length === 0) return <div>Kérdések betöltése...</div>;

  if (testFinished && result) {
    return (
      <div className="test-results">
        <h1>Eredmény</h1>
        <p>{result.score} helyes válasz a {result.total} kérdésből.</p>
        <p>Szint: {result.level}</p>
         <p>Pontosság: {result.total > 0 ? Math.round((result.score / result.total) * 100) : 0}%</p>
        <div className="results-navigation">
          <button className="result-btn" onClick={restartTest}>Új teszt</button>
          <button className="result-btn secondary" onClick={goToKviz}>Vissza a Kvízhez</button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
   if (!currentQuestion) {
        console.error(`Error: Question at index ${currentQuestionIndex} is undefined. Questions array length: ${questions.length}`);
        return <div className="test-page error">Hiba történt a kérdés betöltésekor. <button onClick={restartTest}>Újrapróbálkozás</button></div>;
   }

  const isManualInput = ["fill-in-the-blank", "drag-and-drop", "comparison", "comparison2"].includes(testType);
  const isOptionChoice = ["multiple-choice", "matching", "true-false"].includes(testType);

  return (
    <div className="test-page">
         <div className="progress-indicator">
             Kérdés: {currentQuestionIndex + 1} / {questions.length}
         </div>

      {testType === "multiple-choice" && isOptionChoice && (
        <MultipleChoiceQuiz
          currentQuestion={currentQuestion}
          selectedOption={selectedOption}
          handleOptionSelect={handleOptionSelect}
          showFeedback={showFeedback}
          userAnswer={userAnswers[currentQuestionIndex]}
        />
      )}
      {testType === "matching" && isOptionChoice && (
        <MatchingQuiz
          currentQuestion={currentQuestion}
          selectedOption={selectedOption}
          handleOptionSelect={handleOptionSelect}
          showFeedback={showFeedback}
           userAnswer={userAnswers[currentQuestionIndex]}
        />
      )}
       {testType === "true-false" && isOptionChoice && (
        <TrueFalseQuiz
          currentQuestion={currentQuestion}
          selectedOption={selectedOption}
          handleOptionSelect={handleOptionSelect}
          showFeedback={showFeedback}
           userAnswer={userAnswers[currentQuestionIndex]}
        />
      )}
      {(testType === "fill-in-the-blank" || testType === "comparison" || testType === "comparison2") && isManualInput && (
            <FillInTheBlankQuiz
              currentQuestion={currentQuestion}
              typedAnswer={typedAnswer}
              handleAnswerChange={handleAnswerChange}
              showFeedback={showFeedback}
              userAnswer={userAnswers[currentQuestionIndex]}
            />
        )}
       {testType === "drag-and-drop" && isManualInput && (
            <DragAndDropQuiz
              currentQuestion={currentQuestion}
              typedAnswer={typedAnswer}
              handleAnswerChange={handleAnswerChange}
              showFeedback={showFeedback}
              userAnswer={userAnswers[currentQuestionIndex]}
            />
        )}

      <div className="quiz-navigation">
        <button
            className="nav-btn"
            onClick={handleNextQuestion}
            disabled={showFeedback || !(isManualInput ? typedAnswer.trim() : selectedOption)}
        >
          {currentQuestionIndex < questions.length - 1 ? 'Következő' : 'Befejezés'}
        </button>
      </div>
    </div>
  );
}

export default AdjectiveQuiz;
