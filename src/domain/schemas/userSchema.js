const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  accountNumber: { type: String, required: true, unique: true },
  profileImage: { type: String, default: '' },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  verificationCode: String,
  isSpecial: { type: Boolean, default: false }
});
const User = mongoose.model('User', userSchema);
module.exports = User;