const express = require('express');
const router = express.Router();
const Letter = require('../models/Letter');

// Összes betű lekérése
router.get('/', async (req, res) => {
  try {
    const letters = await Letter.find();
    res.json(letters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 