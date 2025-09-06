const adRepository = require('../../../domain/repositories/adRepository');

const searchAdsByLocation = async (cityId, regionId, page = 1, limit = 20) => {
  const { ads, total } = await adRepository.findByLocation(cityId, regionId, page, limit);
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

module.exports = searchAdsByLocation;