const express = require('express');
const router = express.Router();
const AccommodationHealth = require('../models/AccommodationHealth');

// Összes szállás és egészség kifejezés lekérése
router.get('/', async (req, res) => {
  try {
    const accommodationHealths = await AccommodationHealth.find();
    res.json(accommodationHealths);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 