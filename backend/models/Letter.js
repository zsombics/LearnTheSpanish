const mongoose = require('mongoose');

const letterSchema = new mongoose.Schema({
  letter: {
    type: String,
    required: true
  },
  example: {
    type: String,
    required: true
  },
  hungarian: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Letter', letterSchema); 