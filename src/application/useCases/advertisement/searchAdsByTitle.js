const adRepository = require('../../../domain/repositories/adRepository');

const searchAdsByTitle = async (title, page = 1, limit = 20) => {
  if (!title) {
    throw new Error('title query parameter is required');
  }

  const { ads, total } = await adRepository.findByTitle(title, page, limit);
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

module.exports = searchAdsByTitle;