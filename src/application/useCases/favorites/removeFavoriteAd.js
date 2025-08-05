const userFavoriteAdsRepository = require('../../../domain/repositories/userFavoriteAdsRepository');

const removeFavoriteAd = async (userId, adId) => {
  try {
    // Check if it's actually in favorites
    const isCurrentlyFavorite = await userFavoriteAdsRepository.isFavorite(userId, adId);
    if (!isCurrentlyFavorite) {
      throw new Error('Ad is not in favorites');
    }

    // Remove from favorites
    await userFavoriteAdsRepository.removeFavorite(userId, adId);
    
    return {
      success: true,
      message: 'Ad removed from favorites successfully'
    };
  } catch (error) {
    throw error;
  }
};

module.exports = removeFavoriteAd;
