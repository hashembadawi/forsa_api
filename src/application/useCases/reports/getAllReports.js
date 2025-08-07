const reportsRepository = require('../../../domain/repositories/reportsRepository');
const getAllReports = async (page = 1, limit = 10) => {
  try {
    // Validate input
    if (page < 1 || limit < 1) {
      throw new Error('Page and limit must be greater than 0');
    }

    // Fetch all reports
    const { reports, total } = await reportsRepository.getAllReports(page, limit);

    return {
      success: true,
      message: 'Reports fetched successfully',
      reports,
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    };
  } catch (error) {
    throw error;
  }
}
module.exports = getAllReports;