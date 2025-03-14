const mongoose = require('mongoose');

const WordPairSchema = new mongoose.Schema({
  spanish: {
    type: String,
    required: true,
  },
  hungarian: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('WordPair', WordPairSchema);
