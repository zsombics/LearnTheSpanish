const mongoose = require('mongoose');

const spanishVariedTasksSchema = new mongoose.Schema({
  taskType: {
    type: String,
    required: true
  },
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

module.exports = mongoose.model('SpanishVariedTasks', spanishVariedTasksSchema); 