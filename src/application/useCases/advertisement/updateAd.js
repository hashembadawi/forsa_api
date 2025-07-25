const productRepository = require('../../../domain/repositories/adRepository');

const updateAd = async (adId, userId, updates) => {
  const ad = await adRepository.findById(adId);
  if (!ad) {
    throw new Error('Ad not found');
  }

  if (ad.userId !== userId) {
    throw new Error('Unauthorized to update this ad');
  }

  const updateData = {
    adTitle: updates.adTitle || ad.adTitle,
    price: updates.price || ad.price,
    currencyId: updates.currencyId || ad.currencyId,
    currencyName: updates.currencyName || ad.currencyName,
    description: updates.description || ad.description,
  };

  await adRepository.updateById(adId, updateData);
  return { message: 'Ad updated successfully' };
};

module.exports = updateAd;