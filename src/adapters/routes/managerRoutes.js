const express = require('express');
const router = express.Router();

const managerController = require('../controllers/managerController');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/dashboard-data', authenticateToken, managerController.dashboardData);
router.get('/users-list', authenticateToken, managerController.usersList);


module.exports = router;