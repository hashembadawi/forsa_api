const AdRepository = require('../../../domain/repositories/adRepository');
const UserRepository = require('../../../domain/repositories/userRepository');

const getUserAds = async (userId, page = 1, limit = 5) => {
  const { ads, total } = await AdRepository.findByUserId(userId, page, limit);
  const user = await UserRepository.findById(userId);
  const mappedAds = ads.map(p => ({
    ...p,
    images: [p.pic1, p.pic2, p.pic3, p.pic4, p.pic5, p.pic6].filter(Boolean),
  }));

  return {
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    ads: mappedAds,
    user : {
      userId: user._id,
      phoneNumber: user.phoneNumber,
      name: user.firstName + ' ' + user.lastName,
      profilePicture: user.profileImage,
    }
  };
};

module.exports = getUserAds;