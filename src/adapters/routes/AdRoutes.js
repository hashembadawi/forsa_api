const express = require('express');
const router = express.Router();
const adController = require('../controllers/AdController');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/userAds/add', authenticateToken, adController.addAd);
router.get('/userAds/:userId', authenticateToken, adController.getUserAds);
router.get('/advertiser/:userId', adController.getAdvertiserInfo);
router.delete('/userAds/:id', authenticateToken, adController.deleteAd);
router.put('/userAds/update/:id', authenticateToken, adController.updateAd);
router.get('/', adController.getAllAds);
router.get('/search', adController.searchAdsByLocation);
router.get('/search-advance', adController.searchAdvance);
router.get('/search-by-title', adController.searchAdsByTitle);
router.get('/getAdById/:adId', adController.getAdById);

module.exports = router;