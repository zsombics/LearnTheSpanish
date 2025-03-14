const WordPair = require('../models/WordPair');

exports.getWordPairs = async (req, res) => {
  try {
    const wordPairs = await WordPair.find();
    res.json(wordPairs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Szerver hiba');
  }
};

exports.addWordPair = async (req, res) => {
  const { spanish, hungarian } = req.body;

  try {
    const newWordPair = new WordPair({
      spanish,
      hungarian,
    });

    await newWordPair.save();
    res.status(201).json(newWordPair);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Szerver hiba');
  }
};
