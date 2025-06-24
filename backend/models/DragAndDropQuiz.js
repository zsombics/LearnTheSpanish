const mongoose = require('mongoose');

const dragAndDropQuizSchema = new mongoose.Schema({
  sentence: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('DragAndDropQuiz', dragAndDropQuizSchema); 