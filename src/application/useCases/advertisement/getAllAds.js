const adRepository = require('../../../domain/repositories/adRepository');
const imagesRepository = require('../../../domain/repositories/imagesRepository');

const getAllAds = async (page = 1, limit = 20) => {
  const  images  = await imagesRepository.findAll();
  const { ads, total } = await adRepository.findAll(page, limit);
  const mappedAds = ads.map(({ images, ...rest }) => ({
    ...rest,
    thumbnail: rest.thumbnail,
  }));
  
  return {
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    ads: mappedAds,
    images: images,
  };
};

module.exports = getAllAds;