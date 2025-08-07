const adRepository = require('../../../domain/repositories/adRepository');
const getAdById = async (adId) => {
  try {
    // Fetch the ad by ID
    const ad = await adRepository.findById(adId);
    if (!ad) {
      throw new Error('Ad not found');
    }

    // Map the ad to include images
    const mappedAd = {
      ...ad,
      images: [ad.pic1, ad.pic2, ad.pic3, ad.pic4, ad.pic5, ad.pic6].filter(Boolean),
    };

    return mappedAd;
  } catch (error) {
    throw error;
  }
}

module.exports = getAdById;
