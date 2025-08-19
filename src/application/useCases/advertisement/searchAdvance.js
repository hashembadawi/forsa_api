const adRepository = require('../../../domain/repositories/adRepository');


const searchAdvance = async (
  categoryId,
  subCategoryId,
  page = 1,
  limit = 20,
  filters = {}
) => {
  const { ads, total } = await adRepository.findAdvance(
    categoryId,
    subCategoryId,
    page,
    limit,
    filters
  );
  const mappedAds = ads.map(p => ({
    ...p,
    images: [p.pic1, p.pic2, p.pic3, p.pic4, p.pic5, p.pic6].filter(Boolean),
  }));
  mappedAds.forEach(ad => {
    delete ad.pic1;
    delete ad.pic2;
    delete ad.pic3;
    delete ad.pic4;
    delete ad.pic5;
    delete ad.pic6;
  });
  return {
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    ads: mappedAds,
  };
};

module.exports = searchAdvance;