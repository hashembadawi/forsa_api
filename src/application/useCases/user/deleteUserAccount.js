const userRepository = require('../../../domain/repositories/userRepository');
const deleteUserAccount = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  await userRepository.delete(userId);
  return { message: 'User account deleted successfully' };
}

module.exports = deleteUserAccount;
