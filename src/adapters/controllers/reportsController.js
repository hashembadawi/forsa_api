const { handleServerError } = require('../middleware/errorHandler');
const submitReport = require('../../application/useCases/reports/submitReport');
const getAllReports = require('../../application/useCases/reports/getAllReports');
const deleteReport = require('../../application/useCases/reports/deleteReport');
const getReportById = require('../../application/useCases/reports/getReportById');

const reportsController = {
  async submitReport(req, res) {
    try {
      const { adId, userId, reason,  reportedAt } = req.body;
      const result = await submitReport({ adId, userId, reason,  reportedAt });
      res.status(201).json(result);
    } catch (err) {
      handleServerError(res, err);
    }
  },
  async getAllReports(req, res) {
      try {
      const result = await getAllReports();
      res.status(200).json(result);
      } catch (err) {
      handleServerError(res, err);
      }
  },
  async deleteReport(req, res) {
      try {
      const { reportId } = req.params;
      const result = await deleteReport(reportId);
      res.status(200).json(result);
      } catch (err) {
      handleServerError(res, err);
      }
  },
  async getReportById(req, res) {
    try {
      const { reportId } = req.params;
      const result = await getReportById(reportId);
      if (!result) {
        return res.status(404).json({ message: 'Report not found' });
      }
      res.status(200).json(result);
    } catch (err) {
      handleServerError(res, err);
    }
  }
};

module.exports = reportsController;