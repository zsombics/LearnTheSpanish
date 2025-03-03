import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'D:/LearnTheSpanish/frontend/src/styles/Levels.css';

// Import test type components
import MultipleChoiceQuiz from './quizTypes/MultipleChoiceQuiz';
import FillInTheBlankQuiz from './quizTypes/FillTheBlankV2';
import MatchingQuiz from './quizTypes/MatchingQuiz';
import DragAndDropQuiz from './quizTypes/DragAndDropQuiz';
import TrueFalseQuiz from './quizTypes/TrueFalseQuiz';
import DemoContent from './DemoContent';

// CSV parser for the general adjective tasks (for fill‑in‑the‑blank, comparison, etc.)
// Assumes CSV format: adjective, masculinePlural, english
function parseAdjectivesCSV(data) {
  const lines = data.trim().split("\n");
  return lines.map(line => {
    const [spanish, english, hungarian] = line.split(",").map(item => item.trim());
    return { spanish, english, hungarian };
  });
}

// CSV parser for the multiple-choice tasks
// Expected format: question, correctAnswer, distractor1, distractor2, distractor3, ...
function parseMultipleChoiceCSV(data) {
  const lines = data.trim().split("\n");
  return lines.map(line => {
    const parts = line.split(",").map(item => item.trim());
    return {
      question: parts[0],
      correctAnswer: parts[1],
      options: parts.slice(1) // first option is correct; others are distractors
    };
  });
}

// CSV parser for drag-and-drop tasks – each line is a sentence (the correct order)
function parseDragAndDropCSV(data) {
  const lines = data.trim().split("\n");
  return lines.map(line => line.trim());
}

// CSV parser for the "true-false" tasks (usage)
// Expected format: category, sentence, correctness, explanation
function parseUsageCSV(data) {
  const lines = data.trim().split("\n");
  return lines.map(line => {
    const parts = line.split(",").map(item => item.trim());
    const [category, sentence, correctness, explanation] = parts;
    return { category, sentence, correctAnswer: correctness, explanation };
  });
}

// NEW: CSV parser for matching tasks
// Assumes CSV format: Spanish, English, Hungarian
function parseMatchingAdjectivesCSV(data) {
  const lines = data.trim().split("\n");
  return lines.map(line => {
    const [spanish, english, hungarian] = line.split(",").map(item => item.trim());
    return { spanish, english, hungarian };
  });
}


function AdjectiveQuiz() {
  const navigate = useNavigate();

  // Test settings
  const [numQuestions, setNumQuestions] = useState(5);
  // Possible test types: "multiple-choice", "fill-in-the-blank", "matching", "drag-and-drop", "true-false", "comparison"
  const [testType, setTestType] = useState("multiple-choice");
  const [testStarted, setTestStarted] = useState(false);
  const [showDemo, setShowDemo] = useState(true);

  // Test runtime state
  const [allItems, setAllItems] = useState([]);
  // For some modes we might use allAdjectives (if needed)
  const [allAdjectives, setAllAdjectives] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});

  // Test result state
  const [testFinished, setTestFinished] = useState(false);
  const [result, setResult] = useState(null);

  // Load the CSV file when the test starts
  useEffect(() => {
    if (testStarted) {
      let fileToFetch;
      switch(testType) {
        case "true-false":
          fileToFetch = '/spanish_adjective_usage_500_unique.csv';
          break;
        case "multiple-choice":
          fileToFetch = '/MultipleChoiceQuiz.csv';
          break;
        case "fill-in-the-blank":
            fileToFetch = '/MultipleChoiceQuiz.csv';
            break;
        case "drag-and-drop":
          fileToFetch = '/DragAndDropQuiz.csv';
          break;
        case "matching":
          fileToFetch = '/adjectives.csv';
          break;
        default:
          fileToFetch = '/adjectives.csv';
      }
  
      fetch(fileToFetch)
        .then(response => response.text())
        .then(text => {
          let items;
          switch(testType) {
            case "true-false":
              items = parseUsageCSV(text);
              generateQuestionsUsage(items);
              break;
            case "multiple-choice":
              items = parseMultipleChoiceCSV(text);
              generateMultipleChoiceQuestions(items);
              break;
            case "fill-in-the-blank":
                items = parseMultipleChoiceCSV(text);
                generateMultipleChoiceQuestions(items);
                break;
            case "drag-and-drop":
              items = parseDragAndDropCSV(text);
              generateDragAndDropQuestions(items);
              break;
            case "matching":
              // Use our matching CSV parser that expects: Spanish, English, Hungarian
              items = parseMatchingAdjectivesCSV(text);
              generateMatchingQuestions(items);
              break;
            default:
              items = parseAdjectivesCSV(text);
              generateQuestions(items);
          }
          setAllItems(items);
        })
        .catch(err => console.error("CSV loading error:", err));
    }
  }, [testStarted, testType, numQuestions]);

  // Generate multiple-choice questions
  const generateMultipleChoiceQuestions = (items) => {
    const selectedQuestions = [];
    const shuffledItems = items.sort(() => Math.random() - 0.5).slice(0, numQuestions);
    const fallbackOptions = ["opció1", "opció2", "opció3", "opció4"];
    
    shuffledItems.forEach(item => {
      const correctAnswer = item.correctAnswer;
      // All distractors come from the remaining options in the CSV row
      let distractors = item.options.slice(1);
      let chosenDistractors = [];
      if (distractors.length >= 3) {
        chosenDistractors = distractors.sort(() => Math.random() - 0.5).slice(0, 3);
      } else {
        chosenDistractors = distractors;
        for (let fallback of fallbackOptions) {
          if (!chosenDistractors.includes(fallback) && chosenDistractors.length < 3) {
            chosenDistractors.push(fallback);
          }
        }
      }
      let optionsArray = [correctAnswer, ...chosenDistractors];
      while (optionsArray.length < 4) {
        for (let fallback of fallbackOptions) {
          if (!optionsArray.includes(fallback) && optionsArray.length < 4) {
            optionsArray.push(fallback);
          }
        }
        break;
      }
      optionsArray = optionsArray.sort(() => Math.random() - 0.5);
      selectedQuestions.push({
        question: item.question,
        correctAnswer: correctAnswer,
        options: optionsArray
      });
    });
    const finalQuestions = selectedQuestions.sort(() => Math.random() - 0.5).slice(0, numQuestions);
    setQuestions(finalQuestions);
  };

  // Generate drag-and-drop questions from CSV sentences
  const generateDragAndDropQuestions = (sentences) => {
    const selectedQuestions = [];
    const shuffledSentences = sentences.sort(() => Math.random() - 0.5).slice(0, numQuestions);
    shuffledSentences.forEach(sentence => {
      const words = sentence.split(" ");
      const shuffledWords = [...words].sort(() => Math.random() - 0.5);
      const questionText = `Rendezd sorba a szavakat, hogy helyes legyen a mondat: ${shuffledWords.join(" ")}`;
      selectedQuestions.push({
        question: questionText,
        correctAnswer: sentence
      });
    });
    setQuestions(selectedQuestions);
  };

  // Generate matching questions from adjectives CSV
  // Here we assume the CSV rows are: Spanish, English, Hungarian.
  // The question will display: "Párosítsd: Mi a magyar jelentése a melléknévnek: [Spanish] ([English])?"
  // The correct answer is the Hungarian translation.
  // The distractors are randomly chosen from other rows' Hungarian translations.
  const generateMatchingQuestions = (items) => {
    const selectedQuestions = [];
    // Store all Hungarian translations for distractor purposes
    const allHungarian = items.map(item => item.hungarian);
    for (let i = 0; i < numQuestions; i++) {
      const randomIndex = Math.floor(Math.random() * items.length);
      const item = items[randomIndex];
      const questionText = `Párosítsd: Mi a magyar jelentése a melléknévnek: ${item.spanish} ?`;
      const correctAnswer = item.hungarian;
      // Choose distractors: filter out the correct answer and shuffle the rest
      let distractors = allHungarian.filter(hung => hung !== correctAnswer);
      distractors = distractors.sort(() => Math.random() - 0.5).slice(0, 3);
      let options = [correctAnswer, ...distractors];
      options = options.sort(() => Math.random() - 0.5);
      selectedQuestions.push({
        question: questionText,
        correctAnswer,
        options
      });
    }
    setQuestions(selectedQuestions);
  };

  // Generate general questions for other test types (fill-in-the-blank, comparison)
  const generateQuestions = (adjectives) => {
    const selectedQuestions = [];
    for (let i = 0; i < numQuestions; i++) {
      const randomIndex = Math.floor(Math.random() * adjectives.length);
      const adjItem = adjectives[randomIndex];
      let questionText = "";
      let correctAnswer = "";
      let options = [];
      switch (testType) {
        case "fill-in-the-blank":
          questionText = `Töltsd ki a mondatot: (${adjItem.english}).`;
          correctAnswer = adjItem.masculinePlural;
          break;
        case "comparison":
          questionText = `Mi a magyar megfelelője a következő szónak: ${adjItem.spanish}?`;
          correctAnswer = `${adjItem.hungarian}`;
          break;
        case "comparison2":
            questionText = `Mi a spanyol megfelelője a következő szónak: ${adjItem.hungarian}?`;
            correctAnswer = `${adjItem.spanish}`;
            break;
        default:
          break;
      }
      selectedQuestions.push({
        question: questionText,
        correctAnswer,
        options
      });
    }
    setQuestions(selectedQuestions);
  };

  // Generate questions for true-false type (usage)
  const generateQuestionsUsage = (usageItems) => {
    const selectedQuestions = [];
    for (let i = 0; i < numQuestions; i++) {
      const randomIndex = Math.floor(Math.random() * usageItems.length);
      const usageItem = usageItems[randomIndex];
      const questionText = usageItem.sentence;
      const correctAnswer = usageItem.correctAnswer; // "Helyes" or "Helytelen"
      selectedQuestions.push({
        question: questionText,
        correctAnswer,
        options: ["Helyes", "Helytelen"],
        explanation: usageItem.explanation
      });
    }
    setQuestions(selectedQuestions);
  };

  // Test control functions
  const startTest = () => {
    setTestStarted(true);
    setShowDemo(true);
  };

  const startQuiz = () => {
    setShowDemo(false);
  };

  const handleAnswerChange = (e) => {
    setTypedAnswer(e.target.value);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  // "Next" button handler
  const handleNextQuestion = () => {
    const isManual = ["fill-in-the-blank", "drag-and-drop", "comparison","comparison2"].includes(testType);
    const userResponse = isManual ? typedAnswer : selectedOption;
    if (userResponse.trim() === "") {
      alert("Kérlek, add meg a válaszodat!");
      return;
    }
    setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: userResponse }));
    let isCorrect = false;
    if (testType === "true-false") {
      isCorrect = userResponse === questions[currentQuestionIndex].correctAnswer;
    } else if (isManual) {
      isCorrect = userResponse.trim() === questions[currentQuestionIndex].correctAnswer;
    } else {
      isCorrect = userResponse === questions[currentQuestionIndex].correctAnswer;
    }
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
      setTypedAnswer("");
      setSelectedOption("");
      if (currentQuestionIndex === questions.length - 1) {
        finishTest();
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }, 3000);
  };

  // Finish test: send results to backend and show result
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

  // Restart test: reset all relevant state so that new questions are generated
  const restartTest = () => {
    setTestStarted(false);
    setAllItems([]);
    setAllAdjectives([]);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setTypedAnswer("");
    setSelectedOption("");
    setShowFeedback(false);
    setScore(0);
    setUserAnswers({});
    setTestFinished(false);
    setResult(null);
  };

  // Go back to quiz overview
  const goToKviz = () => {
    window.open("/kviz", "_self");
  };

  // Render test setup screen if test hasn't started
  if (!testStarted) {
    return (
      <div className="test-setup">
        <h1>Válaszd ki a teszt paramétereit</h1>
        <div className="setup-group">
          <label>Hány kérdés legyen a tesztben?</label>
          <select value={numQuestions} onChange={(e) => setNumQuestions(Number(e.target.value))}>
            {[2, 5, 10, 15, 20, 25, 50, 100].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
        <div className="setup-group">
          <label>Teszt típusa:</label>
          <select value={testType} onChange={(e) => setTestType(e.target.value)}>
            <option value="multiple-choice">Többszörös választásos</option>
            <option value="fill-in-the-blank">Kiegészítős feladat</option>
            <option value="matching">Párosító feladat</option>
            <option value="drag-and-drop">Átrendezős feladat</option>
            <option value="true-false">Helyes/Helytelen</option>
            <option value="comparison">Spanyol-Magyar melléknevek</option>
            <option value="comparison2">Magyar-Spanyol melléknevek</option>
          </select>
        </div>
        <button className="start-test-btn" onClick={startTest}>Teszt indítása</button>
      </div>
    );
  }

  // Render demo screen if still visible
  if (showDemo) {
    return (
      <DemoContent testType={testType} startQuiz={startQuiz} />
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
  const isManualInput = ["fill-in-the-blank", "drag-and-drop", "comparison","comparison2"].includes(testType);
  const isOptionChoice = ["multiple-choice", "matching", "true-false"].includes(testType);

  return (
    <div className="test-page">
      {isOptionChoice && (
        <>
          {testType === "multiple-choice" && (
            <MultipleChoiceQuiz
              currentQuestion={currentQuestion}
              selectedOption={selectedOption}
              handleOptionSelect={handleOptionSelect}
              showFeedback={showFeedback}
            />
          )}
          {testType === "matching" && (
            <MatchingQuiz
              currentQuestion={currentQuestion}
              selectedOption={selectedOption}
              handleOptionSelect={handleOptionSelect}
              showFeedback={showFeedback}
            />
          )}
          {testType === "true-false" && (
            <TrueFalseQuiz
              currentQuestion={currentQuestion}
              selectedOption={selectedOption}
              handleOptionSelect={handleOptionSelect}
              showFeedback={showFeedback}
            />
          )}
        </>
      )}
      {isManualInput && (
        <>
          {testType === "fill-in-the-blank" && (
            <FillInTheBlankQuiz
              currentQuestion={currentQuestion}
              typedAnswer={typedAnswer}
              handleAnswerChange={handleAnswerChange}
              showFeedback={showFeedback}
            />
          )}
          {testType === "drag-and-drop" && (
            <DragAndDropQuiz
              currentQuestion={currentQuestion}
              typedAnswer={typedAnswer}
              handleAnswerChange={handleAnswerChange}
              showFeedback={showFeedback}
            />
          )}
          {testType === "comparison" && (
            <FillInTheBlankQuiz
              currentQuestion={currentQuestion}
              typedAnswer={typedAnswer}
              handleAnswerChange={handleAnswerChange}
              showFeedback={showFeedback}
            />
          )}
            {testType === "comparison2" && (
            <FillInTheBlankQuiz
              currentQuestion={currentQuestion}
              typedAnswer={typedAnswer}
              handleAnswerChange={handleAnswerChange}
              showFeedback={showFeedback}
            />
          )}
        </>
      )}
      <div className="quiz-navigation">
        {currentQuestionIndex < questions.length - 1 ? (
          <button className="nav-btn" onClick={handleNextQuestion}>Következő</button>
        ) : (
          <button className="nav-btn" onClick={handleNextQuestion}>Befejezés</button>
        )}
      </div>
    </div>
  );
}

export default AdjectiveQuiz;
