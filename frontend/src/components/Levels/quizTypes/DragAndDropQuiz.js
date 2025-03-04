// src/components/Levels/quizTypes/DragAndDropQuiz.js
import React, { useState, useEffect } from 'react';
import '../../../styles/DragAndDrop.css';
import '../../../styles/FillTheBlank.css';

function DragAndDropQuiz({ currentQuestion, typedAnswer, handleAnswerChange, showFeedback }) {
  const [words, setWords] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Initialize words when question changes
  useEffect(() => {
    const correctWords = currentQuestion.correctAnswer.split(' ');
    const shuffled = [...correctWords].sort(() => Math.random() - 0.5);
    setWords(shuffled);
    // Initialize the answer with shuffled words
    handleAnswerChange({ target: { value: shuffled.join(' ') } });
  }, [currentQuestion.correctAnswer]);

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const newWords = [...words];
    const draggedItem = newWords[draggedIndex];
    
    // Remove dragged item
    newWords.splice(draggedIndex, 1);
    // Insert at new position
    newWords.splice(targetIndex, 0, draggedItem);
    
    setWords(newWords);
    setDraggedIndex(targetIndex);
    handleAnswerChange({ target: { value: newWords.join(' ') } });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDraggedIndex(null);
  };

  return (
    <div className="question-card">
      <h2 className="question-text">{currentQuestion.question}</h2>
      <div className="drag-and-drop-container">
        {words.map((word, index) => (
          <div
            key={index}
            className="draggable-word"
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={handleDrop}
          >
            {word}
          </div>
        ))}
      </div>
      {showFeedback && (
        <div className={`feedback ${typedAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.toLowerCase() ? 'correct-feedback' : 'incorrect-feedback'}`}>
          {typedAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.toLowerCase() ? (
            <p>Helyes válasz!</p>
          ) : (
            <p>
              Hibás válasz! A helyes válasz: <span className="correct-answer">{currentQuestion.correctAnswer}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default DragAndDropQuiz;