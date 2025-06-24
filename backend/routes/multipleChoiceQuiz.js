const express = require('express');
const router = express.Router();
const MultipleChoiceQuiz = require('../models/MultipleChoiceQuiz');

// Összes többszörös választásos kérdés lekérése
router.get('/', async (req, res) => {
  try {
    const quizzes = await MultipleChoiceQuiz.find();
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 