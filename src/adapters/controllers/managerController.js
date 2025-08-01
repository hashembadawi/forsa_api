const getDashboardData = require('../../application/useCases/manager/getDashboardData');
const getUsersList = require('../../application/useCases/manager/getUsersList');
const managerController = {
  async dashboardData(req, res) {
    try {
      await getDashboardData(req, res);
    } catch (err) {
      handleServerError(res, err);
    }
  },
  async usersList(req, res) {
    try {
      const { page = 1, limit = 200 } = req.query;
      const result = await getUsersList(page, limit);
      res.status(200).json(result);
    } catch (err) {
      handleServerError(res, err);
    }
  }
};

module.exports = managerController;