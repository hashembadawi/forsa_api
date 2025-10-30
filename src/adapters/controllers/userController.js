const getMostActiveUsersUseCase = require('../../application/useCases/user/getMostActiveUsers');
const { handleServerError } = require('../middleware/errorHandler');
const registerUser = require('../../application/useCases/user/registerUser');
const loginUser = require('../../application/useCases/user/loginUser');
const updateUserName = require('../../application/useCases/user/updateUserName');
const deleteUserAccount = require('../../application/useCases/user/deleteUserAccount');
const sendVerificationWhatsApp = require('../../application/useCases/user/sendVerificationWhatsApp');
const verifyUser = require('../../application/useCases/user/verifyUser');

const userController = {
  async getMostActiveUsers(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const users = await getMostActiveUsersUseCase(limit);
      res.status(200).json(users);
    } catch (err) {
      handleServerError(res, err);
    }
  },
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

  async validateToken(req, res) {
    try {
      const userRepository = require('../../domain/repositories/userRepository');
      const user = await userRepository.findById(req.user.userId);
      
      if (!user) {
        return res.status(404).json({ valid: false, message: 'User not found' });
      }

      res.status(200).json({
        valid: true,
        user: {
          userId: user._id,
          phoneNumber: user.phoneNumber,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImage: user.profileImage,
          accountNumber: user.accountNumber,
          isVerified: user.isVerified,
          isAdmin: user.isAdmin,
          isSpecial: user.isSpecial
        }
      });
    } catch (err) {
      handleServerError(res, err);
    }
  },
  async deleteUserAccount(req, res) {
    try {
      const userId  = req.body.userId;
      const result = await deleteUserAccount(userId);
      res.status(200).json(result);
    } catch (err) {
      handleServerError(res, err);
    }
  },

  async sendVerificationCode(req, res) {
    try {
      const { phoneNumber } = req.body;
      if (!phoneNumber) {
        return res.status(400).json({ error: 'Phone number is required' });
      }
      
      // Get user's verification code from database
      const userRepository = require('../../domain/repositories/userRepository');
      const user = await userRepository.findByPhoneNumber(phoneNumber);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      if (user.isVerified) {
        return res.status(400).json({ error: 'User is already verified' });
      }
      
      if (!user.verificationCode) {
        // Generate new verification code if doesn't exist
        const newCode = Math.floor(1000 + Math.random() * 9000).toString();
        await userRepository.update(user._id, { verificationCode: newCode });
        user.verificationCode = newCode;
      }
      
      const result = await sendVerificationWhatsApp(phoneNumber, user.verificationCode);
      res.status(200).json(result);
    } catch (err) {
      handleServerError(res, err);
    }
  },

  async verifyPhoneNumber(req, res) {
    try {
      const { phoneNumber, verificationCode } = req.body;
      if (!phoneNumber || !verificationCode) {
        return res.status(400).json({ error: 'Phone number and verification code are required' });
      }
      
      const result = await verifyUser(phoneNumber, verificationCode);
      res.status(200).json(result);
    } catch (err) {
      handleServerError(res, err);
    }
  }
};

module.exports = userController;