const adRepository = require('../../../domain/repositories/adRepository');
const approveAd = async (adId) => {
  try {
    const ad = await adRepository.findById(adId);
    if (!ad) throw new Error('Ad not found');

    ad.isApproved = true;
    await ad.save();
    return ad;
  } catch (error) {
    throw new Error(`Failed to approve ad: ${error.message}`);
  }
};

module.exports = approveAd;
