const adRepository = require('../../../domain/repositories/adRepository');

const searchAdsByTitle = async (title, page = 1, limit = 20) => {
  if (!title) {
    throw new Error('title query parameter is required');
  }

  const { ads, total } = await adRepository.findByTitle(title, page, limit);
  const mappedAds = ads.map(p => ({
    ...p,
    images: [p.pic1, p.pic2, p.pic3, p.pic4, p.pic5, p.pic6].filter(Boolean),
  }));

  return {
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    ads: mappedAds,
  };
};

module.exports = searchAdsByTitle;