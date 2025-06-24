const express = require('express');
const router = express.Router();
const FoodShopping = require('../models/FoodShopping');

// Összes étel és bevásárlás kifejezés lekérése
router.get('/', async (req, res) => {
  try {
    const foodShoppings = await FoodShopping.find();
    res.json(foodShoppings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 