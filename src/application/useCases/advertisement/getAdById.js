const adRepository = require('../../../domain/repositories/adRepository');
const getAdById = async (adId) => {
  try {
    // Fetch the ad by ID
    const ad = await adRepository.findById(adId);
    if (!ad) {
      throw new Error('Ad not found');
    }

    // Convert Mongoose document to plain object
    const adObject = ad.toObject();
    // Return ad with images and thumbnail fields
    return {
      ...adObject,
      images: adObject.images || [],
      thumbnail: adObject.thumbnail,
    };
  } catch (error) {
    throw error;
  }
}

module.exports = getAdById;
