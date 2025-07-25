const bcrypt = require('bcryptjs');
const userRepository = require('../../../domain/repositories/userRepository');

const registerUser = async ({ phoneNumber, firstName, lastName, password }) => {
  if (!phoneNumber || !firstName || !lastName || !password) {
    throw new Error('Missing required fields');
  }

  const existingUser = await userRepository.findByPhoneNumber(phoneNumber);
  if (existingUser) {
    throw new Error('User already exists with this phone number');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const userData = {
    phoneNumber,
    firstName,
    lastName,
    password: hashedPassword,
    isVerified: false,
    verificationCode,
  };

  await userRepository.create(userData);
  // await sendVerificationWhatsApp(phoneNumber, verificationCode); // Uncomment if implemented
  return { message: 'User registered successfully with phone' };
};

module.exports = registerUser;