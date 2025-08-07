const Report = require('../schemas/reportSchema');

class ReportsRepository {
  async submitReport({ adId, userId, reason, description, reportedAt }) {
    const report = new Report({
      adId,
      userId,
      reason,
      description,
      reportedAt: reportedAt || new Date()
    });
    return await report.save();
  }

  async findById(reportId) {
    return await Report.findById(reportId).populate('adId').populate('userId', 'firstName lastName phoneNumber');
  }

  async getAllReports(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const reports = await Report.find()
      .populate('adId')
      .populate('userId', 'firstName lastName phoneNumber')
      .sort({ reportedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await Report.countDocuments();
    return { reports, total };
  }

  async deleteReport(reportId) {
    return await Report.findByIdAndDelete(reportId);
  }

  
}

module.exports = new ReportsRepository();
