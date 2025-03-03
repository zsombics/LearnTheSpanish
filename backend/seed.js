// backend/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const WordPair = require('./models/WordPair');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    const wordPairs = [
      { spanish: 'Hola', hungarian: 'Szia' },
      { spanish: 'Gracias', hungarian: 'Köszönöm' },
      { spanish: 'Adiós', hungarian: 'Viszlát' },
      { spanish: 'Por favor', hungarian: 'Kérem' },
      { spanish: 'Sí', hungarian: 'Igen' },
      { spanish: 'No', hungarian: 'Nem' },
      // További szavak hozzáadása
    ];

    await WordPair.insertMany(wordPairs);
    console.log('Adatok feltöltve');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

connectDB();
