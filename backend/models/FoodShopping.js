const mongoose = require('mongoose');

const foodShoppingSchema = new mongoose.Schema({
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

module.exports = mongoose.model('FoodShopping', foodShoppingSchema); 