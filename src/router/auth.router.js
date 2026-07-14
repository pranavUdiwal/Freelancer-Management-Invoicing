const express = require('express');
const authController = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateChangePassword,
} = require('../middlewares/validators/auth.validator');

const router = express.Router();

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);

router.use(protect);

router.get('/me', authController.getProfile);
router.patch('/update-profile', validateUpdateProfile, authController.updateProfile);
router.patch('/change-password', validateChangePassword, authController.changePassword);

module.exports = router;
