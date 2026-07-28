const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    senderEmail: {
      type: String,
      required: true,
    },
    receiver: {
      type: String,
      required: [true, 'Recipient email is required'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      maxlength: [200, 'Subject cannot exceed 200 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
    attachment: {
      filename: String,
      path: String,
      mimetype: String,
    },
    status: {
      type: String,
      enum: ['sent', 'failed'],
      default: 'sent',
    },
    errorMessage: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Email', emailSchema);
