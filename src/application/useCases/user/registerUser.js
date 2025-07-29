const bcrypt = require('bcryptjs');
const userRepository = require('../../../domain/repositories/userRepository');

const registerUser = async ({ phoneNumber, firstName, lastName, password , profileImage }) => {
  if (!phoneNumber || !firstName || !lastName || !password) {
    throw new Error('Missing required fields');
  }

  const existingUser = await userRepository.findByPhoneNumber(phoneNumber);
  if (existingUser) {
    throw new Error('User already exists with this phone number');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
  // Generate a unique account number 10 digits long contain current date - random number
  const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.floor(100000 + Math.random() * 900000).toString();
  const accountNumber = parseInt(`${currentDate}${randomPart}`, 10);
  const userData = {
    phoneNumber,
    firstName,
    lastName,
    password: hashedPassword,
    profileImage,
    accountNumber,
    isVerified: false,
    verificationCode,
  };

  await userRepository.create(userData);
  // await sendVerificationWhatsApp(phoneNumber, verificationCode); // Uncomment if implemented
  return { message: 'User registered successfully with phone' };
};

module.exports = registerUser;