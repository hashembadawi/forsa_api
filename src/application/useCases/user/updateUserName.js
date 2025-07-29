const userRepository = require('../../../domain/repositories/userRepository');
const updateUserName = async (userId, firstName, lastName) => {
  if (!userId || !firstName || !lastName) {
    throw new Error('Missing required fields');
  }

  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  await userRepository.update(userId, { firstName, lastName });
  return {
    userId: user._id,
    firstName: firstName,
    lastName: lastName,
    phoneNumber: user.phoneNumber,
    profileImage: user.profileImage,
    accountNumber: user.accountNumber,
  };
};

module.exports = updateUserName;