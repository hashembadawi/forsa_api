const { handleServerError } = require('../middleware/errorHandler');
const addFavoriteAd = require('../../application/useCases/favorites/addFavoriteAd');
const removeFavoriteAd = require('../../application/useCases/favorites/removeFavoriteAd');
const getUserFavoriteAds = require('../../application/useCases/favorites/getUserFavoriteAds');

const favoritesController = {
  async addFavorite(req, res) {
    try {
      const { adId } = req.body;
      const userId = req.user.userId;

      if (!adId) {
        return res.status(400).json({ error: 'Ad ID is required' });
      }

      const result = await addFavoriteAd(userId, adId);
      res.status(201).json(result);
    } catch (err) {
      handleServerError(res, err);
    }
  },

  async removeFavorite(req, res) {
    try {
      const { adId } = req.params;
      const userId = req.user.userId;

      const result = await removeFavoriteAd(userId, adId);
      res.status(200).json(result);
    } catch (err) {
      handleServerError(res, err);
    }
  },

  async getUserFavorites(req, res) {
    try {
      const userId = req.user.userId;
      const { page, limit } = req.query;

      const result = await getUserFavoriteAds(userId, page, limit);
      res.status(200).json(result);
    } catch (err) {
      handleServerError(res, err);
    }
  }
};

module.exports = favoritesController;
