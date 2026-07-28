const express = require('express');
const router = express.Router();
const {
  sendEmailHandler,
  getSentMails,
  getMailById,
} = require('../controllers/emailController');
const { protect } = require('../middleware/auth');
const { uploadAttachment } = require('../middleware/upload');
const { emailLimiter } = require('../middleware/rateLimiter');
const { sendEmailValidation, validate } = require('../utils/validation');

router.post(
  '/send-email',
  protect,
  emailLimiter,
  uploadAttachment.single('attachment'),
  sendEmailValidation,
  validate,
  sendEmailHandler
);
router.get('/sent-mails', protect, getSentMails);
router.get('/mail/:id', protect, getMailById);

module.exports = router;
