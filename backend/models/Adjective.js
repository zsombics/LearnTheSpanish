const mongoose = require('mongoose');

const adjectiveSchema = new mongoose.Schema({
  spanish: {
    type: String,
    required: true
  },
  english: {
    type: String,
    required: true
  },
  hungarian: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Adjective', adjectiveSchema); 