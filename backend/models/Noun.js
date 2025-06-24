const mongoose = require('mongoose');

const nounSchema = new mongoose.Schema({
  spanish: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['masculine', 'feminine']
  },
  plural: {
    type: String,
    required: true
  },
  hungarian: {
    type: String,
    required: true
  },
  english: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Noun', nounSchema); 