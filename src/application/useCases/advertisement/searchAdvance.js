const adRepository = require('../../../domain/repositories/adRepository');


const searchAdvance = async (
  categoryId,
  subCategoryId,
  page = 1,
  limit = 20,
  filters = {}
) => {
  // Ensure currencyId is passed as a number if present
    if (filters && filters.currencyId !== undefined && filters.currencyId !== null && filters.currencyId !== '') {
      filters.currencyId = Number(filters.currencyId);
    }
    const { ads, total } = await adRepository.findAdvance(
      categoryId,
      subCategoryId,
      page,
      limit,
      filters
    );
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

module.exports = searchAdvance;