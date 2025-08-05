const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favoritesController');
const authenticateToken = require('../middleware/authenticateToken');

// Add ad to favorites
router.post('/add', authenticateToken, favoritesController.addFavorite);

// Remove ad from favorites
router.delete('/remove/:adId', authenticateToken, favoritesController.removeFavorite);

// Get user's favorite ads
router.get('/my-favorites', authenticateToken, favoritesController.getUserFavorites);

module.exports = router;
