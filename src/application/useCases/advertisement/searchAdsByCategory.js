const adRepository = require('../../../domain/repositories/adRepository');


const searchAdsByCategory = async (categoryId, page = 1, limit = 20) => {
  if (!categoryId) {
    throw new Error('categoryId query parameter is required');
  }

  const { ads, total } = await adRepository.findByCategoryId(categoryId, page, limit);
  const mappedAds = ads.map(p => ({
    ...p,
    thumbnail: p.thumbnail,
  }));

  return {
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    ads: mappedAds,
  };
};

module.exports = searchAdsByCategory;
