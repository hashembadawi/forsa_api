const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  adId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ad',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
    type: String,
    required: true,
    enum: ['spam', 'inappropriate', 'fake', 'fraud', 'other']
  },
  description: {
    type: String,
    maxlength: 500
  },
  reportedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
    default: 'pending'
  }
});

// Index for faster queries
reportSchema.index({ adId: 1, userId: 1 }, { unique: true }); // Prevent duplicate reports
reportSchema.index({ status: 1 });
reportSchema.index({ reportedAt: -1 });

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
