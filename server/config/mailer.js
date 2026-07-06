const nodemailer = require('nodemailer');

/**
 * Create reusable Nodemailer transporter from environment variables
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

/**
 * Send email via SMTP
 */
const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Email App" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    attachments,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendEmail, createTransporter };
