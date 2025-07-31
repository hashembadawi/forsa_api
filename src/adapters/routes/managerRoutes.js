const express = require('express');
const router = express.Router();
const managerController = require('../controllers/managerController');

router.get('/dashboard-data', managerController.dashboardData);


module.exports = router;