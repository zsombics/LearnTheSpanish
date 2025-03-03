// backend/routes/words.js
const express = require('express');
const router = express.Router();

const wordController = require('../controllers/wordController');

// Szó párok lekérdezése
router.get('/', wordController.getWordPairs);

// Szó párok hozzáadása (opcionális, csak ha szükséges)
// router.post('/', wordController.addWordPair);

module.exports = router;
