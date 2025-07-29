const { handleServerError } = require('../middleware/errorHandler');
const registerUser = require('../../application/useCases/user/registerUser');
const loginUser = require('../../application/useCases/user/loginUser');
const updateUserName = require('../../application/useCases/user/updateUserName');
const deleteUserAccount = require('../../application/useCases/user/deleteUserAccount');

const userController = {
  async registerPhone(req, res) {
    try {
      const { phoneNumber, firstName, lastName, password, profileImage } = req.body;
      const result = await registerUser({ phoneNumber, firstName, lastName, password, profileImage });
      res.status(201).json(result);
    } catch (err) {
      handleServerError(res, err);
    }
  },

  async login(req, res) {
    try {
      const { phoneNumber, password } = req.body;
      const result = await loginUser({ phoneNumber, password });
      res.status(200).json(result);
    } catch (err) {
      handleServerError(res, err);
    }
  },
  async updateUserName(req, res) {
    try {
      const { userId, firstName, lastName,profileImage } = req.body;
      const result = await updateUserName(userId, firstName, lastName,profileImage);
      res.status(200).json(result);
    } catch (err) {
      handleServerError(res, err);
    }
  },

  validateToken(req, res) {
    res.status(200).json({ valid: true, user: req.user });
  },
  async deleteUserAccount(req, res) {
    try {
      const userId = req.user.id;
      const result = await deleteUserAccount(userId);
      res.status(200).json(result);
    } catch (err) {
      handleServerError(res, err);
    }
  }
};

module.exports = userController;