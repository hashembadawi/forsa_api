const imagesRepository = require('../../../domain/repositories/imagesRepository');

const saveImage = async (imageData) => {
  const savedImage = await imagesRepository.saveImage(imageData);
  return savedImage._id;
};

module.exports = saveImage;
