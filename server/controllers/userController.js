const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const Email = require('../models/Email');

/**
 * @desc    Get user profile
 * @route   GET /api/profile
 */
const getProfile = async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      verified: req.user.verified,
      role: req.user.role,
      profileImage: req.user.profileImage,
      createdAt: req.user.createdAt,
    },
  });
};

/**
 * @desc    Update user profile
 * @route   PUT /api/profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (req.body.name) user.name = req.body.name;
    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
      user.email = req.body.email;
      user.verified = false;
    }

    if (req.file) {
      // Delete old profile image
      if (user.profileImage) {
        const oldPath = path.join(__dirname, '..', user.profileImage);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      user.profileImage = `/uploads/profiles/${req.file.filename}`;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        verified: user.verified,
        role: user.role,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change password
 * @route   PUT /api/change-password
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete user account
 * @route   DELETE /api/account
 */
const deleteAccount = async (req, res, next) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Password is incorrect' });
    }

    // Delete profile image
    if (user.profileImage) {
      const imagePath = path.join(__dirname, '..', user.profileImage);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    // Delete user's sent emails and attachments
    const emails = await Email.find({ sender: user._id });
    for (const email of emails) {
      if (email.attachment?.path) {
        const attachPath = path.join(__dirname, '..', email.attachment.path);
        if (fs.existsSync(attachPath)) fs.unlinkSync(attachPath);
      }
    }
    await Email.deleteMany({ sender: user._id });

    await User.findByIdAndDelete(user._id);

    res.cookie('token', '', { httpOnly: true, expires: new Date(0) });

    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, changePassword, deleteAccount };
