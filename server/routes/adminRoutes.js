const express = require('express');
const router = express.Router();
const {
  getStats,
  getUsers,
  deleteUser,
  updateUserStatus,
  getEmailLogs,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/status', updateUserStatus);
router.get('/emails', getEmailLogs);

module.exports = router;
