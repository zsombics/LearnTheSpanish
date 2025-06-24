const express = require('express');
const router = express.Router();
const SpanishAdjectiveUsage = require('../models/SpanishAdjectiveUsage');

// Összes melléknév használati példa lekérése
router.get('/', async (req, res) => {
  try {
    const usages = await SpanishAdjectiveUsage.find();
    res.json(usages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 