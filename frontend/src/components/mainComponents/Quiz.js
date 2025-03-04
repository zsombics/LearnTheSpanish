import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import UserContext from '../../UserContext';
import Questions from './Questions'; // Az űrlap, ahol a felhasználó kitölti a kérdőívet
import MainQuizSite from './MainQuizSite';   // Az eredmény megjelenítése, ha már kitöltött

function Quiz() {
  const { user } = useContext(UserContext);
  const [quizCompleted, setQuizCompleted] = useState(null); // null: még nincs betöltve az állapot
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      // Lekérjük az adatbázisból a quiz eredményét a bejelentkezett felhasználónak
      axios
        .get('/api/quiz/result')
        .then((res) => {
          // Most a res.data.quizCompleted mezőt ellenőrizzük!
          if (res.data && res.data.quizCompleted) {
            setQuizCompleted(true);
          } else {
            setQuizCompleted(false);
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Quiz result error:", err);
          // Ha hiba történik, feltételezzük, hogy a kérdőív még nincs kitöltve
          setQuizCompleted(false);
          setIsLoading(false);
        });
    } else {
      // Ha nincs bejelentkezett felhasználó, feltételezzük, hogy a kérdőív nincs kitöltve
      setQuizCompleted(false);
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading || quizCompleted === null) {
    return <div>Betöltés folyamatban...</div>;
  }

  return (
    <>
      {quizCompleted ? <MainQuizSite /> : <Questions />}
    </>
  );
}

export default Quiz;