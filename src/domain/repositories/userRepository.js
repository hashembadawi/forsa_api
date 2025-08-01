const User = require('../schemas/userSchema');

class UserRepository {
  async findByPhoneNumber(phoneNumber) {
    return await User.findOne({ phoneNumber });
  }

  async create(userData) {
    const user = new User(userData);
    return user.save();
  }

  async findByEmailOrPhone(email, phoneNumber) {
    const query = email ? { email } : { phoneNumber };
    return User.findOne(query);
  }
  async findById(userId) {
    return await User.findById(userId);
  }

  async update(userId, updateData) {
    return await User.findByIdAndUpdate(userId, updateData, { new: true });
  }
  async delete(userId) {
    return await User.findByIdAndDelete(userId);
  }
  async countUsers() {
    return await User.countDocuments();
  }
  async findAll({ page = 1, limit = 200 }) {
    const skip = (page - 1) * limit;
    return await User.find().skip(skip).limit(limit);
  }
}

module.exports = new UserRepository();