const express = require('express');
const router = express.Router();
const Adjective = require('../models/Adjective');

// Összes melléknév lekérése
router.get('/', async (req, res) => {
  try {
    const adjectives = await Adjective.find();
    res.json(adjectives);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Szerver hiba');
  }
});

module.exports = router; 