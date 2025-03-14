const express = require('express');
const router = express.Router();

const wordController = require('../controllers/wordController');

router.get('/', wordController.getWordPairs);

module.exports = router;
