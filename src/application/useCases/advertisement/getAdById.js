const adRepository = require('../../../domain/repositories/adRepository');
const getAdById = async (adId) => {
  try {
    // Fetch the ad by ID
    const ad = await adRepository.findById(adId);
    if (!ad) {
      throw new Error('الاعلان غير موجود');
    }

    // Convert Mongoose document to plain object
    const adObject = ad.toObject();
    // Fetch top 5 related ads in the same category (exclude current ad)
    const related = await adRepository.findRelatedByCategory(adObject.categoryId, adId, 5);
    const relatedAds = (related || []).map(({ images, ...rest }) => ({
      ...rest,
      thumbnail: rest.thumbnail,
    }));

    // Return ad with images, thumbnail and relatedAds
    return {
      ...adObject,
      images: adObject.images || [],
      thumbnail: adObject.thumbnail,
      relatedAds
    };
  } catch (error) {
    throw error;
  }
}

module.exports = getAdById;
