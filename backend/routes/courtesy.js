const express = require('express');
const router = express.Router();
const Courtesy = require('../models/Courtesy');

// Összes udvariassági kifejezés lekérése
router.get('/', async (req, res) => {
  try {
    const courtesies = await Courtesy.find();
    res.json(courtesies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 