const reportsRepository = require('../../../domain/repositories/reportsRepository');

const deleteReport = async (reportId) => {
  try {
    const result = await reportsRepository.deleteReport(reportId);
    return {
      success: true,
      message: 'Report deleted successfully',
      report: result
    };
  } catch (error) {
    throw error;
  }
}

module.exports = deleteReport;
