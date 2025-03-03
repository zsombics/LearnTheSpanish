import React, { useState, useEffect } from 'react';
import 'D:/LearnTheSpanish/frontend/src/styles/FeatureCarousel.css';

function FeatureCarousel({ pages, interval = 10000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatikus váltás 10 másodpercenként (vagy a megadott időintervallumban)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % pages.length);
    }, interval);
    return () => clearInterval(timer);
  }, [pages, interval]);

  const goToNext = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % pages.length);
  };

  const goToPrev = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? pages.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="carousel-container">
      {/* A kártya, háttérképpel, ha meg van adva */}
      <div
        className="carousel-card"
        style={{
          backgroundImage: pages[currentIndex].backgroundImage
            ? `url(${pages[currentIndex].backgroundImage})`
            : 'none'
        }}
      >
        <div className="card-overlay">
          <h2>{pages[currentIndex].title}</h2>
          <p>{pages[currentIndex].description}</p>
          {pages[currentIndex].buttonText && pages[currentIndex].buttonLink && (
            <a href={pages[currentIndex].buttonLink} className="cta-button">
              {pages[currentIndex].buttonText}
            </a>
          )}
        </div>
      </div>

      <div className="carousel-controls">
        <button onClick={goToPrev} className="carousel-button prev-button">
          &#10094;
        </button>
        <button onClick={goToNext} className="carousel-button next-button">
          &#10095;
        </button>
      </div>
      <div className="carousel-indicators">
        {pages.map((_, index) => (
          <span
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default FeatureCarousel;
