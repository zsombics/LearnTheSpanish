const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
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

router.post('/request-password-reset', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Nem található felhasználó ezzel az email címmel.' 
      });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 3600000; // 1 óra

    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Jelszó visszaállítási kérelem',
      html: `
        <h2>Jelszó visszaállítási kérelem</h2>
        <p>Kaptál egy jelszó visszaállítási kérelmet a Spanyol Oktató Programtól.</p>
        <p>Kattints az alábbi linkre a jelszó visszaállításához:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #3498db; color: white; text-decoration: none; border-radius: 5px;">
          Jelszó visszaállítása
        </a>
        <p>Ha nem te kérted a jelszó visszaállítását, kérjük hagyd figyelmen kívül ezt az emailt.</p>
        <p>A link 1 óráig érvényes.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ 
      success: true, 
      message: 'A jelszó visszaállítási link elküldve az email címre.' 
    });
  } catch (error) {
    console.error('Jelszó visszaállítási hiba:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Hiba történt a jelszó visszaállítási kérelem feldolgozása során.' 
    });
  }
});

router.post('/reset-password/:token', async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Érvénytelen vagy lejárt visszaállítási link.' 
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: 'A jelszó sikeresen módosítva.' 
    });
  } catch (error) {
    console.error('Jelszó visszaállítási hiba:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Hiba történt a jelszó visszaállítása során.' 
    });
  }
});

router.post(
  '/change-password',
  authMiddleware,
  [
    check('currentPassword', 'A jelenlegi jelszó megadása kötelező').exists(),
    check('newPassword', 'Az új jelszónak legalább 6 karakternek kell lennie').isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: errors.array()[0].msg });
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Felhasználó nem található' });
      }

      const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Hibás jelenlegi jelszó' });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.newPassword, salt);

      await user.save();

      res.json({ success: true, message: 'Jelszó sikeresen módosítva' });
    } catch (error) {
      console.error('Jelszóváltoztatási hiba:', error);
      res.status(500).json({ success: false, message: 'Szerver hiba történt' });
    }
  }
);

router.get('/leaderboard', authMiddleware, authController.getLeaderboard);

module.exports = router;
