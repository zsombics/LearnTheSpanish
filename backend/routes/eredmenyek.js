// backend/routes/quiz.js (vagy a megfelelő útvonal, pl. /api/eredmenyek/submit)
const express = require('express');
const router = express.Router();
const QuizEredmenyek = require('../models/QuizEredmenyek');
const authMiddleware = require('../middleware/auth');

// POST /api/eredmenyek/submit - Elmenti/frissíti a felhasználó quiz eredményét
router.post('/submit', authMiddleware, async (req, res) => {
  try {
    const { answers, level, totalQuestions, correctAnswers, ratio, quizCompleted } = req.body;
    if (!answers || typeof quizCompleted !== 'boolean' || !level || !totalQuestions || typeof correctAnswers !== 'number') {
      return res.status(400).json({ error: 'Érvénytelen adat' });
    }
    
    let quizResult = await QuizEredmenyek.findOne({ user: req.user.id });
    if (quizResult) {
      quizResult.answers = answers;
      quizResult.level = level;
      quizResult.totalQuestions = totalQuestions;
      quizResult.correctAnswers = correctAnswers;
      quizResult.ratio = ratio;
      quizResult.quizCompleted = quizCompleted;
      await quizResult.save();
    } else {
      quizResult = new QuizEredmenyek({
        user: req.user.id,
        answers,
        level,
        totalQuestions,
        correctAnswers,
        ratio,
        quizCompleted
      });
      await quizResult.save();
    }
    
    res.status(200).json({ message: 'Quiz eredmény sikeresen elmentve', result: quizResult });
  } catch (err) {
    console.error("Quiz submit error:", err);
    res.status(500).json({ error: 'Szerver hiba történt a quiz mentésekor' });
  }
});

module.exports = router;
