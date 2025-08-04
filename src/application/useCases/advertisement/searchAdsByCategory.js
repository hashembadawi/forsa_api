const adRepository = require('../../../domain/repositories/adRepository');

const searchAdsByCategory = async (categoryId, subCategoryId, page = 1, limit = 20) => {
  const { ads, total } = await adRepository.findByCategory(categoryId, subCategoryId, page, limit);
  const mappedAds = ads.map(p => ({
    ...p,
    images: [p.pic1, p.pic2, p.pic3, p.pic4, p.pic5, p.pic6].filter(Boolean),
  }));
  //remove pic1, pic2, pic3, pic4, pic5, pic6 from mappedAds
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

module.exports = searchAdsByCategory;