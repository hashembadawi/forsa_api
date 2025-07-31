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
}

module.exports = new UserRepository();