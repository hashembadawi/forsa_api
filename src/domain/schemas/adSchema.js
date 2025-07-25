const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  adTitle: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userPhone: { type: String, required: true },
  pic1: { type: String, required: true },
  pic2: { type: String },
  pic3: { type: String },
  pic4: { type: String },
  pic5: { type: String },
  pic6: { type: String },
  price: { type: String, required: true },
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
});

adSchema.index({ adTitle: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('ad', adSchema);