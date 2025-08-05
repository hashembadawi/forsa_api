const userFavoriteAdsRepository = require('../../../domain/repositories/userFavoriteAdsRepository');
const adRepository = require('../../../domain/repositories/adRepository');

const addFavoriteAd = async (userId, adId) => {
  try {
    // Check if the ad exists
    const ad = await adRepository.findById(adId);
    if (!ad) {
      throw new Error('Ad not found');
    }

    // Check if already favorited
    const isAlreadyFavorite = await userFavoriteAdsRepository.isFavorite(userId, adId);
    if (isAlreadyFavorite) {
      throw new Error('Ad is already in favorites');
    }

    // Add to favorites
    const favorite = await userFavoriteAdsRepository.addFavorite(userId, adId);
    
    return {
      success: true,
      message: 'Ad added to favorites successfully',
      favorite
    };
  } catch (error) {
    throw error;
  }
};

module.exports = addFavoriteAd;
