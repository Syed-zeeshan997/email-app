const nodemailer = require('nodemailer');

/**
 * Create reusable Nodemailer transporter from environment variables.
 * Built once and cached — avoids reconnecting on every single email.
 */
let cachedTransporter = null;

const createTransporter = () => {
  if (cachedTransporter) return cachedTransporter;

  const port = parseInt(process.env.SMTP_PORT, 10) || 587;

  cachedTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465, // 465 = implicit TLS, 587/25 = STARTTLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    pool: true,
    connectionTimeout: 15000, // Render free-tier SMTP handshake ke liye buffer
    greetingTimeout: 15000,
    socketTimeout: 20000,
  });

  return cachedTransporter;
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
