const fs = require('fs');
const { Resend } = require('resend');

/**
 * Create reusable Resend client from environment variables.
 * Built once and cached — avoids re-instantiating the client on every send.
 */
let cachedClient = null;

const getClient = () => {
  if (cachedClient) return cachedClient;

  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not set');
  }

  cachedClient = new Resend(process.env.RESEND_API_KEY);
  return cachedClient;
};

/**
 * Convert multer-style attachments (disk storage: { filename, path } or
 * memory storage: { filename, content/buffer }) into Resend's expected
 * attachment shape: { filename, content: Buffer }.
 */
const normalizeAttachments = (attachments = []) => {
  return attachments.map((attachment) => {
    const filename = attachment.filename || attachment.originalname;

    // Already a Buffer (e.g. memory storage or manually provided content)
    if (attachment.content) {
      const content = Buffer.isBuffer(attachment.content)
        ? attachment.content
        : Buffer.from(attachment.content);
      return { filename, content };
    }

    if (attachment.buffer) {
      return { filename, content: attachment.buffer };
    }

    // Disk storage (multer default) — attachment.path is a filesystem path
    if (attachment.path) {
      const content = fs.readFileSync(attachment.path);
      return { filename, content };
    }

    throw new Error(`Attachment "${filename}" has no readable content or path`);
  });
};

/**
 * Send email via Resend
 */
const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  const client = getClient();

  const mailOptions = {
    from: process.env.RESEND_FROM || 'onboarding@resend.dev',
    to,
    subject,
    html,
    attachments: normalizeAttachments(attachments),
  };

  const { data, error } = await client.emails.send(mailOptions);

  if (error) {
    throw new Error(error.message || 'Failed to send email via Resend');
  }

  return data;
};

module.exports = { sendEmail, getClient };
