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
    // Build filter: categoryId and subCategoryId are the primary (required) filters
    // Other filters (forSale, deliveryService, priceMin/Max, currencyId) are optional
    let filter = {};
    if (categoryId) filter.categoryId = Number(categoryId);
    if (subCategoryId) filter.subCategoryId = Number(subCategoryId);
    filter.isApproved = true;

    const {
      forSale,
      deliveryService,
      priceMin,
      priceMax,
      currencyId
    } = arguments[4] || {};

    if (currencyId !== undefined && currencyId !== null && currencyId !== '') {
      filter.currencyId = Number(currencyId);
    }

    if (typeof forSale !== 'undefined' && forSale !== null && forSale !== '') {
      filter.forSale = forSale === 'true' || forSale === true;
    }

    if (typeof deliveryService !== 'undefined' && deliveryService !== null && deliveryService !== '') {
      filter.deliveryService = deliveryService === 'true' || deliveryService === true;
    }

    // If both priceMin and priceMax provided and not both zero, apply price filter
    if (!(Number(priceMin) === 0 && Number(priceMax) === 0)) {
      if (typeof priceMin !== 'undefined' && priceMin !== '' && priceMin !== null) {
        filter.price = filter.price || {};
        filter.price.$gte = Number(priceMin);
      }
      if (typeof priceMax !== 'undefined' && priceMax !== '' && priceMax !== null) {
        filter.price = filter.price || {};
        filter.price.$lte = Number(priceMax);
      }
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

  // Search ads by a free-text string across title and description
  async findBySearchString(searchString, limit = 5) {
    if (!searchString || String(searchString).trim() === '') return [];
    const regex = new RegExp(searchString, 'i');
    const ads = await Ad.find({
      isApproved: true,
      $or: [
        { adTitle: regex },
        { description: regex }
      ]
    })
      .sort({ createDate: -1 })
      .limit(limit)
      .lean();
    return ads;
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

  // Return related ads with the same categoryId excluding a specific ad id
  async findRelatedByCategory(categoryId, excludeAdId, limit = 5) {
    const filter = { isApproved: true };
    if (categoryId !== undefined && categoryId !== null) filter.categoryId = Number(categoryId);
    if (excludeAdId) filter._id = { $ne: excludeAdId };
    const ads = await Ad.find(filter)
      .sort({ createDate: -1 })
      .limit(limit)
      .lean();
    return ads;
  }
}

module.exports = new AdRepository();