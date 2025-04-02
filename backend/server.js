require('dotenv').config(); 
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

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

app.use('/api/auth', require('./routes/auth'));
app.use('/api/words', require('./routes/words'));
app.use('/api/quiz', require('./routes/quiz'));
app.use('/api/eredmenyek', require('./routes/eredmenyek'));
app.use('/api/user', require('./routes/user'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/game', require('./routes/gameRoutes'));

app.post('/api/translate', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "No text provided" });
  }
  try {
    const params = new URLSearchParams();
    params.append('text', text);
    params.append('target_lang', 'HU');
    params.append('source_lang', 'Es');

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));