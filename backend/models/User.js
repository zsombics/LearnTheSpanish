const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: { type: String, default: null },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  performanceLevel: {
    type: String,
    enum: ['Bronz', 'Ezüst', 'Arany', 'Platina', 'Gyémánt'],
    default: 'Bronz'
  },
  accountLevel: {
    type: Number,
    enum: [1, 2, 3, 4, 5, 6],
    default: 1
  },
  accountLevelName: {
    type: String,
    enum: ['Kezdő', 'Gyakorló', 'Középfokú', 'Haladó', 'Mester', 'Legenda'],
    default: 'Kezdő'
  },
  totalAccuracy: {
    type: Number,
    default: 0
  },
  totalQuizzes: {
    type: Number,
    default: 0
  },
  results: [{
    score: Number,
    date: {
      type: Date,
      default: Date.now,
    },
  }],
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
