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
  return { message: 'User name updated successfully' };
};

module.exports = updateUserName;