const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/register-phone', userController.registerPhone);
router.post('/login', userController.login);
router.get('/validate-token', authenticateToken, userController.validateToken);
router.put('/update-info', authenticateToken, userController.updateUserName);
router.delete('/delete-account', authenticateToken, userController.deleteUserAccount);

module.exports = router;