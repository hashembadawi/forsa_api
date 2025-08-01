const adRepository = require('../../../domain/repositories/adRepository');
const rejectAd = async (adId) => {
  try {
    const ad = await adRepository.findById(adId);
    if (!ad) throw new Error('Ad not found');

    adRepository.deleteById(adId);
    return { success: true, message: 'Ad rejected successfully' };
  } catch (error) {
    throw new Error(`Failed to reject ad: ${error.message}`);
  }
};

module.exports = rejectAd;
