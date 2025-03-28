const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const QuizEredmenyek = require('../models/QuizEredmenyek');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'A felhasználó már létezik' });
    }

    user = new User({
      name,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 óra

    res.status(201).json({ msg: 'Felhasználó regisztrálva!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Szerver hiba');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Helytelen adatok' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Helytelen adatok' });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 óra

    res.json({ msg: 'Sikeres bejelentkezés' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Szerver hiba');
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ msg: 'Sikeres kijelentkezés' });
};

exports.updateUserLevels = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const allResults = await QuizEredmenyek.find({ user: userId });
    
    if (allResults.length > 0) {
      const totalCorrect = allResults.reduce((sum, result) => sum + result.correctAnswers, 0);
      const totalQuestions = allResults.reduce((sum, result) => sum + result.totalQuestions, 0);
      const percentage = (totalCorrect / totalQuestions) * 100;

      let performanceLevel = 'Bronz';
      if (percentage >= 81) performanceLevel = 'Gyémánt';
      else if (percentage >= 61) performanceLevel = 'Platina';
      else if (percentage >= 41) performanceLevel = 'Arany';
      else if (percentage >= 21) performanceLevel = 'Ezüst';

      user.performanceLevel = performanceLevel;
    }

    const totalQuizzes = allResults.length;
    
    let accountLevel = 1;
    let accountLevelName = 'Kezdő';
    
    if (totalQuizzes >= 5000) {
      accountLevel = 6;
      accountLevelName = 'Legenda';
    } else if (totalQuizzes >= 1001) {
      accountLevel = 5;
      accountLevelName = 'Mester';
    } else if (totalQuizzes >= 501) {
      accountLevel = 4;
      accountLevelName = 'Haladó';
    } else if (totalQuizzes >= 101) {
      accountLevel = 3;
      accountLevelName = 'Középfokú';
    } else if (totalQuizzes >= 51) {
      accountLevel = 2;
      accountLevelName = 'Gyakorló';
    }

    user.accountLevel = accountLevel;
    user.accountLevelName = accountLevelName;

    await user.save();
  } catch (err) {
    console.error('Hiba a rangok frissítésekor:', err);
  }
};

exports.updateUserStats = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const allResults = await QuizEredmenyek.find({ user: userId });
    
    if (allResults.length > 0) {
      const totalCorrect = allResults.reduce((sum, result) => sum + result.correctAnswers, 0);
      const totalQuestions = allResults.reduce((sum, result) => sum + result.totalQuestions, 0);
      const totalAccuracy = (totalCorrect / totalQuestions) * 100;

      user.totalAccuracy = totalAccuracy;
      user.totalQuizzes = allResults.length;
    }

    await user.save();
  } catch (err) {
    console.error('Hiba a statisztikák frissítésekor:', err);
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find()
      .select('name totalAccuracy totalQuizzes performanceLevel avatar')
      .sort({ totalAccuracy: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Hiba a ranglista lekérdezésénél' });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Felhasználó nem található' });
    }

    await exports.updateUserStats(req.user.id);
    await exports.updateUserLevels(req.user.id);

    const updatedUser = await User.findById(req.user.id).select('-password');
    
    res.json({ user: updatedUser });
  } catch (error) {
    console.error('Hiba a profil lekérdezésénél:', error);
    res.status(500).json({ message: 'Szerver hiba történt' });
  }
};
