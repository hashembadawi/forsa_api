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

  // Allow optional expiration via environment variable JWT_EXPIRES_IN.
  // If JWT_EXPIRES_IN is not set the token will be created without an expiresIn (no expiration).
  const signOptions = process.env.JWT_EXPIRES_IN ? { expiresIn: process.env.JWT_EXPIRES_IN } : undefined;
  const token = jwt.sign(
    { userId: user._id, username: user.email },
    process.env.JWT_SECRET,
    signOptions
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