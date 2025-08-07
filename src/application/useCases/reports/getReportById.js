const reportsRepository = require('../../../domain/repositories/reportsRepository');

const getReportById = async (reportId) => {
  try {
    const report = await reportsRepository.findById(reportId);
    return report;
  } catch (error) {
    throw error;
  }
}

module.exports = getReportById;
