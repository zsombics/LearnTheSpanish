const mongoose = require('mongoose');

const QuizEredmenyekSchema = new mongoose.Schema({
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
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  ratio: {
    type: Number,
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

module.exports = mongoose.model('QuizEredmenyek', QuizEredmenyekSchema);
