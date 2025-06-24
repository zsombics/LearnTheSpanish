const mongoose = require('mongoose');

const spanishAdjectiveUsageSchema = new mongoose.Schema({
  sentence: {
    type: String,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  explanation: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('SpanishAdjectiveUsage', spanishAdjectiveUsageSchema); 