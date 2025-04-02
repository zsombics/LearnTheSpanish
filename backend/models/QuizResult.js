const mongoose = require('mongoose');

const QuizResultSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  answers: { 
    type: Object, 
    required: true 
  },
  level: { 
    type: String, 
    required: true 
  },
  cityId: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  quizCompleted: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('QuizResult', QuizResultSchema);
