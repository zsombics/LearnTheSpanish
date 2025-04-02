const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const gameController = require('../controllers/gameController');

if (!gameController || typeof gameController.getProgress !== 'function') {
  console.error('Hiba: gameController vagy getProgress nem található!', gameController);
}

router.get('/progress', auth, gameController.getProgress);

router.put('/reveal-password/:cityId', auth, gameController.revealPassword);

router.post('/quiz-result', auth, gameController.processQuizResult);

module.exports = router; 