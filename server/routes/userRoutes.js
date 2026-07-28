const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { uploadProfile } = require('../middleware/upload');
const {
  profileValidation,
  changePasswordValidation,
  validate,
} = require('../utils/validation');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, uploadProfile.single('profileImage'), profileValidation, validate, updateProfile);
router.put('/change-password', protect, changePasswordValidation, validate, changePassword);
router.delete('/account', protect, deleteAccount);

module.exports = router;
