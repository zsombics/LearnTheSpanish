function FillInTheBlankQuiz({ currentQuestion, typedAnswer, handleAnswerChange, showFeedback }) {
    const { highlightedText, percentageCorrect } = highlightDifferences(
        typedAnswer.trim(), 
        currentQuestion.correctAnswer
    );

    return (
        <div className="question-card">
            <h2 className="question-text">
                {currentQuestion.question}
            </h2>
            
            <input 
                type="text" 
                value={typedAnswer} 
                onChange={handleAnswerChange} 
                placeholder="Írd be a válaszodat..." 
            />

            {showFeedback && (
                <div className="feedback">
                    <div 
                        dangerouslySetInnerHTML={{ __html: highlightedText }} 
                    />
                    <p>Helyes karakterek: {percentageCorrect}%</p>
                    <p>Helyes válasz: {currentQuestion.correctAnswer}</p>
                </div>
            )}
        </div>
    );
}