const mongoose = require('mongoose');

const courtesySchema = new mongoose.Schema({
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

module.exports = mongoose.model('Courtesy', courtesySchema); 