const ImagesRepository = require('../../../domain/repositories/imagesRepository');

const deleteImageById = async (id) => {
  return await ImagesRepository.deleteImageById(id);
};

module.exports = deleteImageById;
