const adRepository = require('../../../domain/repositories/adRepository');

const searchAdsByCategory = async (categoryId, page, limit) => {
  return adRepository.findByCategoryId(categoryId, page, limit);
};

module.exports = searchAdsByCategory;
