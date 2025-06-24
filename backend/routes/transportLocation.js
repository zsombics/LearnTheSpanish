const express = require('express');
const router = express.Router();
const TransportLocation = require('../models/TransportLocation');

// Összes közlekedési és helymeghatározási kifejezés lekérése
router.get('/', async (req, res) => {
  try {
    const transportLocations = await TransportLocation.find();
    res.json(transportLocations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 