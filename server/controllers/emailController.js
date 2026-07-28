const path = require('path');
const Email = require('../models/Email');
const { sendEmail } = require('../config/mailer');
const { composeEmailHtml } = require('../utils/emailTemplates');

/**
 * @desc    Send email
 * @route   POST /api/send-email
 */
const sendEmailHandler = async (req, res, next) => {
  try {
    const { receiver, subject, message } = req.body;
    const sender = req.user;

    const attachmentData = req.file
      ? {
          filename: req.file.originalname,
          path: `/uploads/attachments/${req.file.filename}`,
          mimetype: req.file.mimetype,
        }
      : null;

    const mailAttachments = req.file
      ? [{ filename: req.file.originalname, path: req.file.path }]
      : [];

    let status = 'sent';
    let errorMessage = '';

    try {
      await sendEmail({
        to: receiver,
        subject,
        html: composeEmailHtml(sender.name, message),
        attachments: mailAttachments,
      });
    } catch (emailError) {
      status = 'failed';
      errorMessage = emailError.message;
    }

    const emailRecord = await Email.create({
      sender: sender._id,
      senderEmail: sender.email,
      receiver,
      subject,
      message,
      attachment: attachmentData,
      status,
      errorMessage,
    });

    if (status === 'failed') {
      return res.status(500).json({
        success: false,
        message: 'Failed to send email',
        email: emailRecord,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Email sent successfully',
      email: emailRecord,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get sent emails for current user
 * @route   GET /api/sent-mails
 */
const getSentMails = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    const query = { sender: req.user._id };

    if (search) {
      query.$or = [
        { receiver: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Email.countDocuments(query);
    const emails = await Email.find(query)
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

/**
 * @desc    Get single email details
 * @route   GET /api/mail/:id
 */
const getMailById = async (req, res, next) => {
  try {
    const email = await Email.findOne({
      _id: req.params.id,
      sender: req.user._id,
    });

    if (!email) {
      return res.status(404).json({ success: false, message: 'Email not found' });
    }

    res.json({ success: true, email });
  } catch (error) {
    next(error);
  }
};

module.exports = { sendEmailHandler, getSentMails, getMailById };
