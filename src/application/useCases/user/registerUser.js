const bcrypt = require('bcryptjs');
const userRepository = require('../../../domain/repositories/userRepository');
const sendVerificationWhatsApp = require('./sendVerificationWhatsApp');

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
  
  // Send verification code via WhatsApp
  try {
    await sendVerificationWhatsApp(phoneNumber, verificationCode);
    return { 
      message: 'User registered successfully. Verification code sent via WhatsApp.',
      phoneNumber: phoneNumber,
      requiresVerification: true
    };
  } catch (whatsappError) {
    console.error('Failed to send WhatsApp verification:', whatsappError);
    // User is still created, but verification failed
    return { 
      message: 'User registered successfully, but failed to send verification code. Please try resending.',
      phoneNumber: phoneNumber,
      requiresVerification: true,
      verificationError: true
    };
  }
};

module.exports = registerUser;