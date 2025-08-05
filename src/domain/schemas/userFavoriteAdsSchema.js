const mongoose = require('mongoose');

const userFavoriteAdsSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  adId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ad', 
    required: true 
  },
  addedDate: { 
    type: Date, 
    default: Date.now 
  }
});

// Create compound index to ensure a user can't favorite the same ad twice
userFavoriteAdsSchema.index({ userId: 1, adId: 1 }, { unique: true });

// Index for faster queries when getting user's favorite ads
userFavoriteAdsSchema.index({ userId: 1, addedDate: -1 });

// Index for faster queries when checking if an ad is favorited
userFavoriteAdsSchema.index({ adId: 1 });

const UserFavoriteAds = mongoose.model('UserFavoriteAds', userFavoriteAdsSchema);

module.exports = UserFavoriteAds;
