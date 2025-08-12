const userRepository = require('../../../domain/repositories/userRepository');

const updateUser = async (userId, isSpecial) => {
  try {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const updatedUser = await userRepository.updateStatus(userId, isSpecial);
    return { message: 'User updated successfully', user: updatedUser };
  } catch (err) {
    throw new Error('Error updating user');
  }
};

module.exports = updateUser;
