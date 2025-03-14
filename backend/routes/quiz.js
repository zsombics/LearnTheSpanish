const express = require('express');
const router = express.Router();
const QuizResult = require('../models/QuizResult');
const authMiddleware = require('../middleware/auth');

router.get('/result', authMiddleware, async (req, res) => {
  try {
    const result = await QuizResult.findOne({ user: req.user.id });
    if (!result || !result.quizCompleted) {
      return res.status(200).json({ completed: false });
    }
    return res.json(result);
  } catch (err) {
    console.error("Quiz result error:", err);
    res.status(500).json({ error: 'Szerver hiba történt' });
  }
});



router.post('/submit', authMiddleware, async (req, res) => {
  try {
    const { answers, level, quizCompleted } = req.body;

    let result = await QuizResult.findOne({ user: req.user.id });
    if (result) {
      result.answers = answers;
      result.level = level;
      result.quizCompleted = quizCompleted;
      await result.save();
    } else {
      result = new QuizResult({
        user: req.user.id,
        answers,
        level,
        quizCompleted
      });
      await result.save();
    }
    res.json({ message: 'Quiz eredmény sikeresen elmentve', result });
  } catch (err) {
    console.error("Quiz submit error:", err);
    res.status(500).json({ error: 'Szerver hiba történt a quiz mentésekor' });
  }
});

module.exports = router;
