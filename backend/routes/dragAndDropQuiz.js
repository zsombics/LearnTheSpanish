const express = require('express');
const router = express.Router();
const DragAndDropQuiz = require('../models/DragAndDropQuiz');

// Összes húzd és ejtsd kérdés lekérése
router.get('/', async (req, res) => {
  try {
    const quizzes = await DragAndDropQuiz.find();
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 