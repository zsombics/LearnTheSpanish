import React, { useState } from 'react';
import 'D:/LearnTheSpanish/frontend/src/styles/translate.css';

const Level6 = () => {
    const [inputValue, setInputValue] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [error, setError] = useState('');
  
    const handleInputChange = (event) => {
      setInputValue(event.target.value);
      setError('');
    };
  
    const handleTranslate = async () => {
      if (!inputValue.trim()) {
        setError('Kérlek írj be egy szót!');
        return;
      }
  
      try {
        const response = await fetch("http://localhost:5000/api/translate", { // Use your backend endpoint
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: inputValue }),
        });
        const data = await response.json();
        if (data.translations && data.translations.length > 0) {
          setTranslatedText(data.translations[0].text);
        } else {
          setError('Nem sikerült lefordítani a szót.');
        }
      } catch (err) {
        console.error(err);
        setError('Hálózati hiba történt.');
      }
    };
  
    return (
      <div className="translation-container">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Írj be egy magyar szót"
          className="translation-input"
        />
        <button onClick={handleTranslate} className="translate-btn">
          Lefordít
        </button>
        {translatedText && (
          <div className="translation-result">
            <strong>Fordítás:</strong> {translatedText}
          </div>
        )}
        {error && <div className="translation-error">{error}</div>}
      </div>
    );
  };
  
  export default Level6;
