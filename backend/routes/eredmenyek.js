const express = require('express');
const router = express.Router();
const QuizEredmenyek = require('../models/QuizEredmenyek');
const authMiddleware = require('../middleware/auth');

router.post('/submit', authMiddleware, async (req, res) => {
  try {
    const { answers, level, totalQuestions, correctAnswers, ratio, quizCompleted } = req.body;
    if (!answers || typeof quizCompleted !== 'boolean' || !level || !totalQuestions || typeof correctAnswers !== 'number') {
      return res.status(400).json({ error: 'Érvénytelen adat' });
    }
    const quizResult = new QuizEredmenyek({
      user: req.user.id,
      answers,
      level,
      totalQuestions,
      correctAnswers,
      ratio,
      quizCompleted
    });
    await quizResult.save();
    
    res.status(200).json({ message: 'Quiz eredmény sikeresen elmentve', result: quizResult });
  } catch (err) {
    console.error("Quiz submit error:", err);
    res.status(500).json({ error: 'Szerver hiba történt a quiz mentésekor' });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const eredmenyek = await QuizEredmenyek.find({ user: req.user.id })
      .sort({ createdAt: -1 });
      
    res.status(200).json(eredmenyek);
  } catch (err) {
    console.error("Quiz eredmények lekérési hiba:", err);
    res.status(500).json({ error: 'Szerver hiba történt az eredmények lekérésekor' });
  }
});

module.exports = router;
