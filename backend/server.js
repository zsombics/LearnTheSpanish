require('dotenv').config(); 
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const mongoose = require('mongoose');

const app = express();

connectDB();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Nagy fájl méret kezelése
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cookieParser());

// Email küldő konfiguráció
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Jelszó visszaállítási oldal
app.get('/reset-password/:token', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const wordRoutes = require('./routes/words');
const adjectiveRoutes = require('./routes/adjectives');
const nounsRouter = require('./routes/nouns');
const lettersRouter = require('./routes/letters');
const transportLocationRouter = require('./routes/transportLocation');
const foodShoppingRouter = require('./routes/foodShopping');
const courtesyRouter = require('./routes/courtesy');
const communicationRouter = require('./routes/communication');
const accommodationHealthRouter = require('./routes/accommodationHealth');
const multipleChoiceQuizRouter = require('./routes/multipleChoiceQuiz');
const dragAndDropQuizRouter = require('./routes/dragAndDropQuiz');
const spanishAdjectiveUsageRouter = require('./routes/spanishAdjectiveUsage');
const spanishVariedTasksRouter = require('./routes/spanishVariedTasks');

app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/words', wordRoutes);
app.use('/api/adjectives', adjectiveRoutes);
app.use('/api/nouns', nounsRouter);
app.use('/api/letters', lettersRouter);
app.use('/api/transport-location', transportLocationRouter);
app.use('/api/food-shopping', foodShoppingRouter);
app.use('/api/courtesy', courtesyRouter);
app.use('/api/communication', communicationRouter);
app.use('/api/accommodation-health', accommodationHealthRouter);
app.use('/api/multiple-choice-quiz', multipleChoiceQuizRouter);
app.use('/api/drag-and-drop-quiz', dragAndDropQuizRouter);
app.use('/api/spanish-adjective-usage', spanishAdjectiveUsageRouter);
app.use('/api/spanish-varied-tasks', spanishVariedTasksRouter);
app.use('/api/eredmenyek', require('./routes/eredmenyek'));
app.use('/api/user', require('./routes/user'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/game', require('./routes/gameRoutes'));

app.post('/api/translate', async (req, res) => {
  const { text, direction = 'hu-es' } = req.body;
  if (!text) {
    return res.status(400).json({ error: "No text provided" });
  }
  
  try {
    const params = new URLSearchParams();
    params.append('text', text);
    
    // Irány alapján beállítjuk a forrás és cél nyelveket
    if (direction === 'es-hu') {
      params.append('target_lang', 'HU');
      params.append('source_lang', 'ES');
    } else {
      // Alapértelmezett: magyar -> spanyol
      params.append('target_lang', 'ES');
      params.append('source_lang', 'HU');
    }

    const response = await fetch("https://api-free.deepl.com/v2/translate", {
      method: "POST",
      headers: {
        "Authorization": "DeepL-Auth-Key " + process.env.DEEPL_API_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error calling DeepL API:", err);
    res.status(500).json({ error: "Translation failed" });
  }
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
  );
}

// MongoDB kapcsolat
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB kapcsolat létrejött'))
  .catch(err => console.error('MongoDB kapcsolódási hiba:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Szerver fut a ${PORT} porton`);
});