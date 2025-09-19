const ImagesRepository = require('../../../domain/repositories/imagesRepository');

const getAllImages = async (page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  const images = await ImagesRepository.findAll(offset, limit);
  return images;
};

module.exports = getAllImages;
