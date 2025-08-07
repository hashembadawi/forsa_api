const reportsRepository = require('../../../domain/repositories/reportsRepository');

const submitReport = async ({ adId, userId, reason, description, reportedAt }) => {
  try {
    // Validate input
    if (!adId || !userId || !reason) {
      throw new Error('Missing required fields: adId, userId, reason');
    }

    // Create the report
    const report = await reportsRepository.submitReport({
      adId,
      userId,
      reason,
      description,
      reportedAt: reportedAt || new Date()
    });

    return {
      success: true,
      message: 'Report submitted successfully',
      report
    };
  } catch (error) {
    throw error;
  }
};

module.exports = submitReport;
