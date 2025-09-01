const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../../../domain/repositories/userRepository');

const loginUser = async ({ phoneNumber, password }) => {
  if (!phoneNumber) {
    throw new Error('Phone number is required');
  }

  const user = await userRepository.findByPhoneNumber(phoneNumber);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { userId: user._id, username: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '150h' }
  );

  return {
    token,
    userFirstName: user.firstName,
    userLastName: user.lastName,
    userEmail: user.email,
    userId: user._id,
    userPhone: user.phoneNumber,
    userProfileImage: user.profileImage,
    userAccountNumber: user.accountNumber,
    userIsVerified: user.isVerified,
    userIsAdmin: user.isAdmin,
    userIsSpecial: user.isSpecial
  };
};

module.exports = loginUser;