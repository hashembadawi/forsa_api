const adRepository = require('../../../domain/repositories/adRepository');
const getNotApprovedAds = async (page, limit) => {
  try {
    const ads = await adRepository.findNotApprovedAds({ page, limit });
    return ads
  } catch (error) {
    throw new Error(`Failed to retrieve not approved ads: ${error.message}`);
  }
}

module.exports = getNotApprovedAds;