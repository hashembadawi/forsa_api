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
}

module.exports = new UserRepository();