const express = require('express');
const router = express.Router();

const managerController = require('../controllers/managerController');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/dashboard-data', authenticateToken, managerController.dashboardData);
router.get('/users-list', authenticateToken, managerController.usersList);
router.get('/notApproved-ads', authenticateToken, managerController.notApprovedAds);
router.put('/approve-ad/:id', authenticateToken, managerController.approveAd);
router.delete('/reject-ad/:id', authenticateToken, managerController.rejectAd);
router.post('/update-user', authenticateToken, managerController.updateUser);
router.post('/images-mgm', authenticateToken, managerController.saveImage);


module.exports = router;