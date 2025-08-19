const userFavoriteAdsRepository = require('../../../domain/repositories/userFavoriteAdsRepository');

const getUserFavoriteAds = async (userId, page = 1, limit = 10) => {
  try {
    const { favorites, total } = await userFavoriteAdsRepository.getUserFavorites(userId, page, limit);
    
    // Map the favorites to include ad details and format images
    const mappedFavorites = favorites.map(favorite => {
      const ad = favorite.adId ? {
        ...favorite.adId,
        images: [
          favorite.adId.pic1,
          favorite.adId.pic2,
          favorite.adId.pic3,
          favorite.adId.pic4,
          favorite.adId.pic5,
          favorite.adId.pic6
        ].filter(Boolean)
      } : null;
      if (ad) {
        delete ad.pic1;
        delete ad.pic2;
        delete ad.pic3;
        delete ad.pic4;
        delete ad.pic5;
        delete ad.pic6;
      }
      return {
        favoriteId: favorite._id,
        addedDate: favorite.addedDate,
        ad
      };
    });
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
