const getDashboardData = require('../../application/useCases/manager/getDashboardData');
const getUsersList = require('../../application/useCases/manager/getUsersList');
const getNotApprovedAds = require('../../application/useCases/manager/getNotApprovedAds');
const approveAd = require('../../application/useCases/manager/approveAd');
const rejectAd = require('../../application/useCases/manager/rejectAd');
const updateUser = require('../../application/useCases/manager/updateUser');
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
  },
  async notApprovedAds(req, res) {
    try {
      const { page = 1, limit = 200 } = req.query;
      const result = await getNotApprovedAds(page, limit);
      res.status(200).json(result);
    } catch (err) {
      handleServerError(res, err);
    }
  },
  async approveAd(req, res) {
    try {
      const adId = req.params.id;
      const result = await approveAd(adId);
      res.status(200).json(result);
    } catch (err) {
      handleServerError(res, err);
    }
  },
  async rejectAd(req, res) {
    try {
      const adId = req.params.id;
      const result = await rejectAd(adId);
      res.status(200).json(result);
    } catch (err) {
      handleServerError(res, err);
    }
  },
  async updateUser(req, res) {
    try {
      const { userId, isSpecial } = req.body;
      const result = await updateUser(userId, isSpecial);
      res.status(200).json(result);
    } catch (err) {
      handleServerError(res, err);
    }
  }
};

module.exports = managerController;