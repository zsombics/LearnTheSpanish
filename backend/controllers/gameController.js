const User = require('../models/User');
const QuizResult = require('../models/QuizResult');

const getCityIdFromLevel = (level) => {
  const levelNumber = parseInt(level.replace('Level', ''));
  return levelNumber >= 1 && levelNumber <= 8 ? levelNumber : null;
};

const calculateConsecutiveCorrect = (recentResults) => {
  let count = 0;
  for (let i = recentResults.length - 1; i >= 0; i--) {
    if (recentResults[i]) {
      count++;
    } else {
      break;
    }
  }
  return count;
};

const getProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('gameProgress');
    res.json(user.gameProgress);
  } catch (error) {
    console.error('Error fetching game progress:', error);
    res.status(500).json({ message: 'Szerver hiba történt' });
  }
};

const revealPassword = async (req, res) => {
  try {
    const { cityId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Felhasználó nem található' });
    }

    const cityProgress = user.gameProgress.find(progress => progress.cityId === parseInt(cityId));
    if (!cityProgress) {
      return res.status(404).json({ message: 'Város haladás nem található' });
    }

    cityProgress.passwordRevealed = true;
    await user.save();

    res.json({ message: 'Jelszó sikeresen felfedve' });
  } catch (error) {
    console.error('Error revealing password:', error);
    res.status(500).json({ message: 'Szerver hiba történt' });
  }
};

const processQuizResult = async (req, res) => {
  try {
    const { answers, level } = req.body;
    const userId = req.user.id;

    const cityId = getCityIdFromLevel(level);
    if (!cityId) {
      return res.status(400).json({ message: 'Érvénytelen level' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Felhasználó nem található' });
    }

    const isCorrect = answers.correctAnswers === answers.totalQuestions;

    const quizResult = new QuizResult({
      user: userId,
      answers,
      level,
      cityId,
      isCorrect,
      quizCompleted: true
    });
    await quizResult.save();

    let cityProgress = user.gameProgress.find(progress => progress.cityId === cityId);
    
    if (!cityProgress) {
      cityProgress = {
        cityId,
        level,
        recentResults: [],
        consecutiveCorrect: 0,
        passwordRevealed: false
      };
      user.gameProgress.push(cityProgress);
    }

    cityProgress.recentResults.push(isCorrect);
    if (cityProgress.recentResults.length > 10) {
      cityProgress.recentResults.shift();
    }

    cityProgress.consecutiveCorrect = calculateConsecutiveCorrect(cityProgress.recentResults);

    await user.save();

    res.json({
      message: 'Eredmény sikeresen mentve',
      consecutiveCorrect: cityProgress.consecutiveCorrect
    });
  } catch (error) {
    console.error('Error processing quiz result:', error);
    res.status(500).json({ message: 'Szerver hiba történt' });
  }
};

module.exports = {
  getProgress,
  revealPassword,
  processQuizResult
}; 