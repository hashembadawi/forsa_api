const userRepository = require('../../../domain/repositories/userRepository');
const adRepository = require('../../../domain/repositories/adRepository');
const getDashboardData = async (req, res) => {
  try {
    const userCount = await userRepository.countUsers();
    const notApprovedAdsCount = await adRepository.countNotApprovedAds(); 
    const approvedAdsCount = await adRepository.countApprovedAds(); 
    const dashboardData = {
      userCount,
      notApprovedAdsCount,
      approvedAdsCount
    };

    res.status(200).json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    handleServerError(res, error);
  }
}
module.exports = getDashboardData;