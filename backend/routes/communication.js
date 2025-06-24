const express = require('express');
const router = express.Router();
const Communication = require('../models/Communication');

// Összes kommunikációs kifejezés lekérése
router.get('/', async (req, res) => {
  try {
    const communications = await Communication.find();
    res.json(communications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 