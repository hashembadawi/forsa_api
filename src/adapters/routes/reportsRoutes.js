const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/submit', authenticateToken, reportsController.submitReport);
router.get('/', authenticateToken, reportsController.getAllReports);
router.delete('/:reportId', authenticateToken, reportsController.deleteReport);
router.get('/:reportId', authenticateToken, reportsController.getReportById);

module.exports = router;
