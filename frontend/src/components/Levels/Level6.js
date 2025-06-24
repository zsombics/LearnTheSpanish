import React, { useState } from 'react';
import '../../styles/translate.css';

const Level6 = () => {
    const [inputValue, setInputValue] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [error, setError] = useState('');
    const [direction, setDirection] = useState('hu-es'); // 'hu-es' vagy 'es-hu'
  
    const handleInputChange = (event) => {
      setInputValue(event.target.value);
      setError('');
    };

    const handleDirectionChange = (newDirection) => {
      setDirection(newDirection);
      setTranslatedText('');
      setError('');
    };
  
    const handleTranslate = async () => {
      if (!inputValue.trim()) {
        setError('Kérlek írj be valamit!');
        return;
      }
  
      try {
        const response = await fetch("http://localhost:5000/api/translate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            text: inputValue,
            direction: direction 
          }),
        });
        const data = await response.json();
        if (data.translations && data.translations.length > 0) {
          setTranslatedText(data.translations[0].text);
        } else {
          setError('Nem sikerült lefordítani a szöveget.');
        }
      } catch (err) {
        console.error(err);
        setError('Hálózati hiba történt.');
      }
    };

    const getPlaceholder = () => {
      return direction === 'hu-es' ? 'Írj be valamit magyarul' : 'Escribe algo en español';
    };

    const getDescription = () => {
      return direction === 'hu-es' 
        ? 'Írj be valamit magyarul, és a DeepL AI technológiával lefordítjuk spanyolra.'
        : 'Escribe algo en español y lo traduciremos al húngaro con tecnología AI de DeepL.';
    };
  
    return (
        <div className="translation-container">
            <h2 className="translation-header">DeepL Integrált AI Fordító</h2>
            <p className="translation-description">
                {getDescription()}
            </p>
            
            <div className="direction-selector">
                <button 
                    className={`direction-btn ${direction === 'hu-es' ? 'active' : ''}`}
                    onClick={() => handleDirectionChange('hu-es')}
                >
                    <span className="direction-text">Magyar → Spanyol</span>
                </button>
                <button 
                    className={`direction-btn ${direction === 'es-hu' ? 'active' : ''}`}
                    onClick={() => handleDirectionChange('es-hu')}
                >
                    <span className="direction-text">Spanyol → Magyar</span>
                </button>
            </div>

            <textarea
                value={inputValue}
                onChange={handleInputChange}
                placeholder={getPlaceholder()}
                className="translation-input"
                rows="4"
            />
            <button onClick={handleTranslate} className="translate-btn">
                Lefordít
            </button>
            {translatedText && (
                <div className="translation-result">
                    <strong>Fordítás:</strong>
                    <div className="translated-text">{translatedText}</div>
                </div>
            )}
            {error && <div className="translation-error">{error}</div>}
      </div>
    );
  };
  
  export default Level6;