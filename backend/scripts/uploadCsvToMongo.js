const fs = require('fs');
const path = require('path');
const csv = require('csv-parse');
const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB URI ellenőrzése
if (!process.env.MONGO_URI) {
  console.error('Hiba: A MONGO_URI környezeti változó nincs beállítva!');
  process.exit(1);
}

// Modellek importálása
const Adjective = require('../models/Adjective');
const Noun = require('../models/Noun');
const Word = require('../models/Word');
const Letter = require('../models/Letter');
const TransportLocation = require('../models/TransportLocation');
const FoodShopping = require('../models/FoodShopping');
const Courtesy = require('../models/Courtesy');
const Communication = require('../models/Communication');
const AccommodationHealth = require('../models/AccommodationHealth');
const MultipleChoiceQuiz = require('../models/MultipleChoiceQuiz');
const DragAndDropQuiz = require('../models/DragAndDropQuiz');
const SpanishAdjectiveUsage = require('../models/SpanishAdjectiveUsage');
const SpanishVariedTasks = require('../models/SpanishVariedTasks');

// MongoDB kapcsolat
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB kapcsolat létrejött'))
  .catch(err => {
    console.error('MongoDB kapcsolódási hiba:', err);
    process.exit(1);
  });

// CSV fájlok feltöltése
async function uploadCsvToMongo() {
  const csvDir = path.join(__dirname, '../../frontend/public');
  const files = fs.readdirSync(csvDir).filter(file => file.endsWith('.csv'));

  for (const file of files) {
    console.log(`Feltöltés: ${file}`);
    const filePath = path.join(csvDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    const parser = csv.parse({
      columns: true,
      skip_empty_lines: true,
      delimiter: ';'  // Pontosvessző használata elválasztóként
    });

    const records = [];
    parser.on('readable', function() {
      let record;
      while ((record = parser.read()) !== null) {
        records.push(record);
      }
    });

    parser.on('error', function(err) {
      console.error(`Hiba a ${file} feldolgozása közben:`, err);
    });

    parser.on('end', async function() {
      try {
        let Model;
        let transformData;

        switch (file) {
          case 'adjectives.csv':
            Model = Adjective;
            transformData = (record) => ({
              spanish: record.Spanish,
              english: record.English,
              hungarian: record.Hungarian
            });
            break;

          case 'nouns.csv':
            Model = Noun;
            transformData = (record) => ({
              spanish: record.Spanish,
              gender: record.Gender,
              plural: record.Plural,
              hungarian: record.Hungarian,
              english: record.English
            });
            break;

          case 'words.csv':
            Model = Word;
            transformData = (record) => ({
              spanish: record.Spanish,
              hungarian: record.Hungarian,
              english: record.English
            });
            break;

          case 'letters.csv':
            Model = Letter;
            transformData = (record) => ({
              letter: record.Letter,
              example: record.Example,
              hungarian: record.Hungarian
            });
            break;

          case 'transport_location.csv':
            Model = TransportLocation;
            transformData = (record) => ({
              spanish: record.Spanish,
              english: record.English,
              hungarian: record.Hungarian
            });
            break;

          case 'food_shopping.csv':
            Model = FoodShopping;
            transformData = (record) => ({
              spanish: record.Spanish,
              english: record.English,
              hungarian: record.Hungarian
            });
            break;

          case 'courtesy.csv':
            Model = Courtesy;
            transformData = (record) => ({
              spanish: record.Spanish,
              english: record.English,
              hungarian: record.Hungarian
            });
            break;

          case 'communication.csv':
            Model = Communication;
            transformData = (record) => ({
              spanish: record.Spanish,
              english: record.English,
              hungarian: record.Hungarian
            });
            break;

          case 'accommodation_health.csv':
            Model = AccommodationHealth;
            transformData = (record) => ({
              spanish: record.Spanish,
              english: record.English,
              hungarian: record.Hungarian
            });
            break;

          case 'MultipleChoiceQuiz.csv':
            Model = MultipleChoiceQuiz;
            transformData = (record) => ({
              sentence: record.Sentence,
              options: [record.Option1, record.Option2, record.Option3, record.Option4]
            });
            break;

          case 'DragAndDropQuiz.csv':
            Model = DragAndDropQuiz;
            transformData = (record) => ({
              sentence: record.Sentence
            });
            break;

          case 'spanish_adjective_usage_500_unique.csv':
            Model = SpanishAdjectiveUsage;
            transformData = (record) => ({
              sentence: record.Sentence,
              isCorrect: record.IsCorrect === 'true',
              explanation: record.Explanation
            });
            break;

          case 'spanish_varied_tasks_500.csv':
            Model = SpanishVariedTasks;
            transformData = (record) => ({
              taskType: record.TaskType,
              sentence: record.Sentence,
              isCorrect: record.IsCorrect === 'true',
              explanation: record.Explanation
            });
            break;

          default:
            console.log(`Ismeretlen fájl formátum: ${file}`);
            return;
        }

        // Adatok törlése a modellből
        await Model.deleteMany({});

        // Adatok feltöltése
        const transformedRecords = records.map(transformData);
        await Model.insertMany(transformedRecords);

        console.log(`${file} sikeresen feltöltve`);
      } catch (err) {
        console.error(`Hiba a ${file} feltöltése közben:`, err);
      }
    });

    parser.write(fileContent);
    parser.end();
  }
}

uploadCsvToMongo()
  .then(() => {
    console.log('Minden fájl feltöltése befejeződött');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Hiba történt:', err);
    mongoose.connection.close();
  }); 