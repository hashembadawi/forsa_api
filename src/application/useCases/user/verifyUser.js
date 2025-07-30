const userRepository = require('../../../domain/repositories/userRepository');

const verifyUser = async (phoneNumber, verificationCode) => {
  try {
    if (!phoneNumber || !verificationCode) {
      throw new Error('Phone number and verification code are required');
    }

    // Find user by phone number
    const user = await userRepository.findByPhoneNumber(phoneNumber);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if user is already verified
    if (user.isVerified) {
      return { success: true, message: 'User is already verified' };
    }

    // Check if verification code matches
    if (user.verificationCode !== verificationCode) {
      throw new Error('Invalid verification code');
    }

    // Update user verification status
    await userRepository.update(user._id, { 
      isVerified: true, 
      verificationCode: null // Clear the verification code
    });

    return { 
      success: true, 
      message: 'User verified successfully',
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        firstName: user.firstName,
        lastName: user.lastName,
        isVerified: true
      }
    };

  } catch (error) {
    console.error('Error in verifyUser:', error);
    throw error;
  }
};

module.exports = verifyUser;
