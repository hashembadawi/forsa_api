const Ad = require('../schemas/adSchema');

class AdRepository {
  async create(adData) {
    const ad = new Ad(adData);
    return ad.save();
  }

  async findByUserId(userId, page, limit) {
    const skip = (page - 1) * limit;
    const ads = await Ad.find({ userId })
      .sort({ createDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    const total = await Ad.countDocuments({ userId });
    return { ads, total };
  }

  async findById(id) {
    return Ad.findById(id);
  }

  async deleteById(id) {
    return Ad.findByIdAndDelete(id);
  }

  async updateById(id, updates) {
    return Ad.findByIdAndUpdate(id, updates, { new: true });
  }

  async findAll(page, limit) {
    const skip = (page - 1) * limit;
    // Find where isApproved is true and order by isSpecial first, then createDate descending
    const ads = await Ad.find({ isApproved: true })
      .sort({ isSpecial: -1, createDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    const total = await Ad.countDocuments({ isApproved: true });
    return { ads, total };
  }

  async findByLocation(cityId, regionId, page, limit) {
    const filter = {};
    if (cityId) filter.cityId = Number(cityId);
    if (regionId) filter.regionId = Number(regionId);
    filter.isApproved = true;
    const skip = (page - 1) * limit;
    const ads = await Ad.find(filter)
      .sort({ createDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    const total = await Ad.countDocuments(filter);
    return { ads, total };
  }

  async findByCategory(categoryId, subCategoryId, page, limit) {
    const filter = {};
    if (categoryId) filter.categoryId = Number(categoryId);
    if (subCategoryId) filter.subCategoryId = Number(subCategoryId);
    filter.isApproved = true;
    const skip = (page - 1) * limit;
    const ads = await Ad.find(filter)
      .sort({ createDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    const total = await Ad.countDocuments(filter);
    return { ads, total };
  }

  async findByTitle(title, page, limit) {
    const regex = new RegExp(title, 'i');
    const skip = (page - 1) * limit;
    const filter = { isApproved: true };
    if (title) filter.adTitle = regex;
    const ads = await Ad.find(filter)
      .sort({ createDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    const total = await Ad.countDocuments(filter);
    return { ads, total };
  }

  async countNotApprovedAds() {
    return await Ad.countDocuments({ isApproved: false });
  }
  
  async countApprovedAds() {
    return await Ad.countDocuments({ isApproved: true });
  }
  async findNotApprovedAds({ skip = 0, limit = 200 }) {
    return await Ad.find({ isApproved: false })
      .sort({ createDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
  }
}

module.exports = new AdRepository();