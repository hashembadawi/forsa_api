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
    // Map the ad to include images
    const mappedAd = {
      ...adObject,
      images: [adObject.pic1, adObject.pic2, adObject.pic3, adObject.pic4, adObject.pic5, adObject.pic6].filter(Boolean),
    };
    delete mappedAd.pic1;
    delete mappedAd.pic2;
    delete mappedAd.pic3;
    delete mappedAd.pic4;
    delete mappedAd.pic5;
    delete mappedAd.pic6;

    return mappedAd;
  } catch (error) {
    throw error;
  }
}

module.exports = getAdById;
