const { handleServerError } = require('../middleware/errorHandler');
const registerUser = require('../../application/useCases/user/registerUser');
const loginUser = require('../../application/useCases/user/loginUser');
const updateUserName = require('../../application/useCases/user/updateUserName');

const userController = {
  async registerPhone(req, res) {
    try {
      const { phoneNumber, firstName, lastName, password } = req.body;
      const result = await registerUser({ phoneNumber, firstName, lastName, password });
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
      const { userId, firstName, lastName } = req.body;
      const result = await updateUserName(userId, firstName, lastName);
      res.status(200).json(result);
    } catch (err) {
      handleServerError(res, err);
    }
  },

  validateToken(req, res) {
    res.status(200).json({ valid: true, user: req.user });
  },
};

module.exports = userController;