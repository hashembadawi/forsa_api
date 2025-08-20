const { handleServerError } = require('../middleware/errorHandler');
const addAd = require('../../application/useCases/advertisement/addAd');
const getUserAds = require('../../application/useCases/advertisement/getUserAds');
const deleteAd = require('../../application/useCases/advertisement/deleteAd');
const updateAd = require('../../application/useCases/advertisement/updateAd');
const getAllAds = require('../../application/useCases/advertisement/getAllAds');
const searchAdsByLocation = require('../../application/useCases/advertisement/searchAdsByLocation');
const searchAdvance = require('../../application/useCases/advertisement/searchAdvance');
const searchAdsByTitle = require('../../application/useCases/advertisement/searchAdsByTitle');
const getAdvertiserInfo = require('../../application/useCases/advertisement/getUserAds'); 
const getAdById = require('../../application/useCases/advertisement/getAdById');
const searchAdsByCategory = require('../../application/useCases/advertisement/searchAdsByCategory');

const adController = {
  async addAd(req, res) {
    try {
      if (req.body && req.body.price !== undefined) {
        req.body.price = parseFloat(req.body.price);
      }
      const result = await addAd(req.body, req.user.userId);
      res.status(201).json(result);
    } catch (err) {
      handleServerError(res, err);
    }
  },

  async getUserAds(req, res) {
    try {
      const { userId } = req.params;
      const { page, limit } = req.query;
      if (userId !== req.user.userId) {
        return res.status(403).json({ message: 'Unauthorized access' });
      }
      const result = await getUserAds(userId, page, limit);
      res.json(result);
    } catch (err) {
      handleServerError(res, err);
    }
  },

  async deleteAd(req, res) {
    try {
      const result = await deleteAd(req.params.id, req.user.userId);
      res.json(result);
    } catch (err) {
      handleServerError(res, err);
    }
  },

  async updateAd(req, res) {
    try {
      const { adTitle, price, currencyId, currencyName, description, forSale, deliveryService } = req.body;
      const result = await updateAd(req.params.id, req.user.userId, {
        adTitle,
        price: price !== undefined ? parseFloat(price) : price,
        currencyId,
        currencyName,
        description,
        forSale,
        deliveryService
      });
      res.json(result);
    } catch (err) {
      handleServerError(res, err);
    }
  },

  async getAllAds(req, res) {
    try {
      const { page, limit } = req.query;
      const result = await getAllAds(page, limit);
      res.json(result);
    } catch (err) {
      handleServerError(res, err);
    }
  },

  async searchAdsByLocation(req, res) {
    try {
      const { cityId, regionId, page, limit } = req.query;
      const result = await searchAdsByLocation(cityId, regionId, page, limit);
      res.json(result);
    } catch (err) {
      handleServerError(res, err);
    }
  },

  async searchAdvance(req, res) {
    try {
      const {
        categoryId,
        subCategoryId,
        page,
        limit,
        forSale,
        deliveryService,
        priceMin,
        priceMax,
        currencyId
      } = req.query;
      const filters = {
        forSale,
        deliveryService,
        priceMin,
        priceMax,
        currencyId
      };
      const result = await searchAdvance(
        categoryId,
        subCategoryId,
        page,
        limit,
        filters
      );
      res.json(result);
    } catch (err) {
      handleServerError(res, err);
    }
  },

  async searchAdsByTitle(req, res) {
    try {
      const { title, page, limit } = req.query;
      const result = await searchAdsByTitle(title, page, limit);
      res.json(result);
    } catch (err) {
      handleServerError(res, err);
    }
  },
  async getAdvertiserInfo(req, res) {
    try {
      const { userId } = req.params;
      const result = await getAdvertiserInfo(userId);
      res.json(result);
    } catch (err) {
      handleServerError(res, err);
    }
  },
  async getAdById(req, res) {
    try {
      const { adId } = req.params;
      const result = await getAdById(adId);
      if (!result) {
        return res.status(404).json({ message: 'Ad not found' });
      }
      res.json(result);
    } catch (err) {
      handleServerError(res, err);
    }
  },
  async searchAdsByCategory(req, res) {
    try {
      const { categoryId, page, limit } = req.query;
      const result = await searchAdsByCategory(categoryId, page, limit);
      res.json(result);
    } catch (err) {
      handleServerError(res, err);
    }
  }
};

module.exports = adController;