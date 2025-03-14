const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

router.post(
  '/register',
  [
    check('name', 'A név megadása kötelező').not().isEmpty(),
    check('email', 'Érvényes email cím szükséges').isEmail(),
    check('password', 'A jelszónak legalább 6 karakternek kell lennie').isLength({ min: 6 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    authController.register(req, res);
  }
);

router.post(
  '/login',
  [
    check('email', 'Érvényes email cím szükséges').isEmail(),
    check('password', 'A jelszó megadása kötelező').exists(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    authController.login(req, res);
  }
);

router.get('/logout', authController.logout);

router.get('/profile', authMiddleware, authController.getUserProfile);

module.exports = router;
