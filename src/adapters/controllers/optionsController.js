const { currencies, categories, subCategories, provinces, majorAreas } = require('../../utils/constants');

const optionsController = {
  getOptions(req, res) {
    res.json({
      currencies,
      categories,
      subCategories,
      Province: provinces,
      majorAreas,
    });
  },
};

module.exports = optionsController;