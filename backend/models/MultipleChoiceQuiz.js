const mongoose = require('mongoose');

const multipleChoiceQuizSchema = new mongoose.Schema({
  sentence: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }]
});

module.exports = mongoose.model('MultipleChoiceQuiz', multipleChoiceQuizSchema); 