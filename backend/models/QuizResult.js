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
