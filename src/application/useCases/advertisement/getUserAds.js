const productRepository = require('../../../domain/repositories/adRepository');

const getUserAds = async (userId, page = 1, limit = 5) => {
  const { ads, total } = await adRepository.findByUserId(userId, page, limit);
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

module.exports = getUserAds;