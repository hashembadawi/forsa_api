const adRepository = require('../../../domain/repositories/adRepository');
const userRepository = require('../../../domain/repositories/userRepository');

// Returns users sorted by number of ads posted (descending)
const getMostActiveUsers = async (limit = 10) => {
  // Aggregate ads to count per userId
  const Ad = require('../../../domain/schemas/adSchema');
  const User = require('../../../domain/schemas/userSchema');

  const agg = await Ad.aggregate([
    { $match: { isApproved: true } },
    { $group: { _id: '$userId', adCount: { $sum: 1 } } },
    { $match: { adCount: { $gt: 5 } } },
    { $sort: { adCount: -1 } },
    { $limit: limit },
  ]);

  // Fetch user details for each userId
  const users = await Promise.all(
    agg.map(async ({ _id, adCount }) => {
      const user = await User.findById(_id).lean();
      if (!user) return null;
      return {
        userId: _id,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        profileImage: user.profileImage,
        adCount,
      };
    })
  );

  return users.filter(Boolean);
};

module.exports = getMostActiveUsers;
