const express = require('express');
const router = express.Router();
const SpanishVariedTasks = require('../models/SpanishVariedTasks');

// Összes változatos feladat lekérése
router.get('/', async (req, res) => {
  try {
    const tasks = await SpanishVariedTasks.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 