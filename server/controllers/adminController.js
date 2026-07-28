const User = require('../models/User');
const Email = require('../models/Email');

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/admin/stats
 */
const getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalEmails = await Email.countDocuments();
    const suspendedUsers = await User.countDocuments({ suspended: true });
    const verifiedUsers = await User.countDocuments({ verified: true, role: 'user' });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalEmails,
        suspendedUsers,
        verifiedUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all users with search and pagination
 * @route   GET /api/admin/users
 */
const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    const query = { role: 'user' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/admin/users/:id
 */
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Cannot delete admin accounts' });
    }

    await Email.deleteMany({ sender: user._id });
    await User.findByIdAndDelete(user._id);

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Suspend or unsuspend user
 * @route   PUT /api/admin/users/:id/status
 */
const updateUserStatus = async (req, res, next) => {
  try {
    const { suspended } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Cannot modify admin accounts' });
    }

    user.suspended = suspended;
    await user.save();

    res.json({
      success: true,
      message: suspended ? 'User suspended' : 'User unsuspended',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        suspended: user.suspended,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all email logs
 * @route   GET /api/admin/emails
 */
const getEmailLogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    const query = {};

    if (search) {
      query.$or = [
        { receiver: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { senderEmail: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Email.countDocuments(query);
    const emails = await Email.find(query)
      .populate('sender', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-message');

    res.json({
      success: true,
      emails,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats, getUsers, deleteUser, updateUserStatus, getEmailLogs };
