const UserFavoriteAds = require('../schemas/userFavoriteAdsSchema');

class UserFavoriteAdsRepository {
  async addFavorite(userId, adId) {
    const favorite = new UserFavoriteAds({ userId, adId });
    return await favorite.save();
  }

  async removeFavorite(userId, adId) {
    return await UserFavoriteAds.findOneAndDelete({ userId, adId });
  }

  async isFavorite(userId, adId) {
    const favorite = await UserFavoriteAds.findOne({ userId, adId });
    return !!favorite;
  }

  async getUserFavorites(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const favorites = await UserFavoriteAds.find({ userId })
      .populate('adId')
      .sort({ addedDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await UserFavoriteAds.countDocuments({ userId });
    return { favorites, total };
  }

  async getAdFavoriteCount(adId) {
    return await UserFavoriteAds.countDocuments({ adId });
  }
}

module.exports = new UserFavoriteAdsRepository();
