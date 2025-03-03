// backend/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Regisztráció
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Felhasználó létezésének ellenőrzése
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'A felhasználó már létezik' });
    }

    user = new User({
      name,
      email,
      password,
    });

    // Jelszó hash-elése
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Felhasználó mentése
    await user.save();

    // JWT token létrehozása
    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Token küldése sütiben
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 óra

    res.status(201).json({ msg: 'Felhasználó regisztrálva!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Szerver hiba');
  }
};

// Bejelentkezés
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Felhasználó keresése
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Helytelen adatok' });
    }

    // Jelszó ellenőrzése
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Helytelen adatok' });
    }

    // JWT token létrehozása
    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Token küldése sütiben
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 óra

    res.json({ msg: 'Sikeres bejelentkezés' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Szerver hiba');
  }
};

// Kijelentkezés
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ msg: 'Sikeres kijelentkezés' });
};

// Felhasználói adatok lekérdezése
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Szerver hiba');
  }
};
