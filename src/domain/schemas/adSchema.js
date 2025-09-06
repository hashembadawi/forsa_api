const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  adTitle: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userPhone: { type: String, required: true },
  images: {
    type: [{ type: String }],
    required: false
  },
  thumbnail: { type: String, required: true },
  price: { type: Number, required: true, set: v => v == null ? v : parseFloat(v) },
  currencyId: { type: Number, required: true },
  currencyName: { type: String, required: true },
  categoryId: { type: Number, required: true },
  categoryName: { type: String, required: true },
  subCategoryId: { type: Number, required: true },
  subCategoryName: { type: String, required: true },
  cityId: { type: Number, required: true },
  cityName: { type: String, required: true },
  regionId: { type: Number, required: true },
  regionName: { type: String, required: true },
  createDate: { type: Date, required: true },
  description: { type: String, required: true },
  isApproved: { type: Boolean, default: false },
  isNew: { type: Boolean, default: true },
  forSale: { type: Boolean, default: true },
  deliveryService: { type: Boolean, default: false },
  isSpecial: { type: Boolean, default: false },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  }
});

adSchema.index({ adTitle: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('ad', adSchema);
