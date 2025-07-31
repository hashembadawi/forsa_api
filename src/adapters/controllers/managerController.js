const getDashboardData = require('../../application/useCases/manager/getDashboardData');
const managerController = {
  async dashboardData(req, res) {
    try {
      await getDashboardData(req, res);
    } catch (err) {
      handleServerError(res, err);
    }
  }
};

module.exports = managerController;