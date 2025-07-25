const express = require('express');
const router = express.Router();
const adController = require('../controllers/AdController');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/userAds/add', authenticateToken, adController.addAd);
router.get('/userAds/:userId', authenticateToken, adController.getUserAds);
router.delete('/userAds/:id', authenticateToken, adController.deleteAd);
router.put('/userAds/update/:id', authenticateToken, adController.updateAd);
router.get('/', adController.getAllAds);
router.get('/search', adController.searchAdsByLocation);
router.get('/search-by-category', adController.searchAdsByCategory);
router.get('/search-by-title', adController.searchAdsByTitle);

module.exports = router;