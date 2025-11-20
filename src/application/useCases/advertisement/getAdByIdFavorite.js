const adRepository = require('../../../domain/repositories/adRepository');
const userFavoriteAdsRepository = require('../../../domain/repositories/userFavoriteAdsRepository');
const getAdByIdFavorite = async (adId, userId) => {
    try {
        // Fetch the ad by ID
        // use the existing findById repository method (findByIdFavorite did not exist)
        const ad = await adRepository.findById(adId);
        if (!ad) {
            throw new Error('الاعلان غير موجود');
        }
        // Convert Mongoose document to plain object
        const adObject = ad.toObject();
        // Check whether this ad is in the user's favorites
        const isFav = await userFavoriteAdsRepository.isFavorite(userId, adId);

        // Return ad with images, thumbnail and isFavorite flag
        return {
            ...adObject,
            images: adObject.images || [],
            thumbnail: adObject.thumbnail,
            isFavorite: !!isFav
        };
    } catch (error) {
        throw error;
    }
}

module.exports = getAdByIdFavorite;