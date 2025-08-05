const userFavoriteAdsRepository = require('../../../domain/repositories/userFavoriteAdsRepository');

const getUserFavoriteAds = async (userId, page = 1, limit = 10) => {
  try {
    const { favorites, total } = await userFavoriteAdsRepository.getUserFavorites(userId, page, limit);
    
    // Map the favorites to include ad details and format images
    const mappedFavorites = favorites.map(favorite => ({
      favoriteId: favorite._id,
      addedDate: favorite.addedDate,
      ad: {
        ...favorite.adId,
        images: [
          favorite.adId.pic1,
          favorite.adId.pic2,
          favorite.adId.pic3,
          favorite.adId.pic4,
          favorite.adId.pic5,
          favorite.adId.pic6
        ].filter(Boolean)
      }
    }));

    return {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      favorites: mappedFavorites
    };
  } catch (error) {
    throw error;
  }
};

module.exports = getUserFavoriteAds;
