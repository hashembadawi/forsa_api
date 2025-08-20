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

  async findAdvance(categoryId, subCategoryId, page, limit) {
    const {
      forSale,
      deliveryService,
      priceMin,
      priceMax,
      currencyId
    } = arguments[4] || {};
    // All values are required and must be sent (not undefined, null, or empty string)
    if (
      forSale === undefined || forSale === null || forSale === '' ||
      deliveryService === undefined || deliveryService === null || deliveryService === '' ||
      priceMin === undefined || priceMin === null || priceMin === '' ||
      priceMax === undefined || priceMax === null || priceMax === ''
    ) {
      throw new Error('forSale, deliveryService, priceMin, and priceMax must be sent');
    }
    const filter = {};
    if (categoryId) filter.categoryId = Number(categoryId);
    if (subCategoryId) filter.subCategoryId = Number(subCategoryId);
    if (currencyId !== undefined && currencyId !== null && currencyId !== '') filter.currencyId = Number(currencyId);
    filter.isApproved = true;
    filter.forSale = forSale === 'true' || forSale === true;
    filter.deliveryService = deliveryService === 'true' || deliveryService === true;
    // If priceMin and priceMax are both 0, do not filter by price
    if (!(Number(priceMin) === 0 && Number(priceMax) === 0)) {
      filter.price = {};
      if (typeof priceMin !== 'undefined' && priceMin !== '' && priceMin !== null) filter.price.$gte = Number(priceMin);
      if (typeof priceMax !== 'undefined' && priceMax !== '' && priceMax !== null) filter.price.$lte = Number(priceMax);
    }
    const skip = (page - 1) * limit;
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

  async findByTitle(title, page, limit) {
    const skip = (page - 1) * limit;
    const regex = new RegExp(title, 'i'); // Case-insensitive search
    const ads = await Ad.find({ adTitle: regex, isApproved: true })
      .sort({ createDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    const total = await Ad.countDocuments({ adTitle: regex, isApproved: true });
    return { ads, total };
  }

  //findByCategoryId
  async findByCategoryId(categoryId, page, limit) {
    const skip = (page - 1) * limit;
    const ads = await Ad.find({ categoryId: Number(categoryId), isApproved: true })
      .sort({ createDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    const total = await Ad.countDocuments({ categoryId: Number(categoryId), isApproved: true });
    return { ads, total };
  }
}

module.exports = new AdRepository();