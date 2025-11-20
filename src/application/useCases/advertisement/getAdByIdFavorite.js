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

        // Fetch top 5 related ads in the same category (exclude current ad)
        const related = await adRepository.findRelatedByCategory(adObject.categoryId, adId, 5);
        const relatedAds = (related || []).map(({ images, ...rest }) => ({
            ...rest,
            thumbnail: rest.thumbnail,
        }));

        // Return ad with images, thumbnail, isFavorite flag and relatedAds
        return {
            ...adObject,
            images: adObject.images || [],
            thumbnail: adObject.thumbnail,
            isFavorite: !!isFav,
            relatedAds
        };
    } catch (error) {
        throw error;
    }
}

module.exports = getAdByIdFavorite;