const productRepository = require('../../../domain/repositories/adRepository');

const deleteAd = async (adId, userId) => {
  const ad = await adRepository.findById(adId);
  if (!ad) {
    throw new Error('Ad not found');
  }

  if (ad.userId !== userId) {
    throw new Error('Unauthorized to delete this ad');
  }

  await adRepository.deleteById(adId);
  return { message: 'Ad deleted successfully' };
};

module.exports = deleteAd;