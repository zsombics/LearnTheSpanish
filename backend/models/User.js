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
  // Egyéb felhasználói adatok (pl. eredmények)
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
