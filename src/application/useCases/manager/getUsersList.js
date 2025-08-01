const userRepository = require('../../../domain/repositories/userRepository');

const getUsersList = async (page, limit) => {
  const users = await userRepository.findAll({ page, limit });
  return users;
};

module.exports = getUsersList;
