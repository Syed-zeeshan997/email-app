/**
 * Email HTML templates
 */

const verificationEmail = (name, verifyUrl) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #4f46e5;">Welcome to Email App!</h2>
    <p>Hi ${name},</p>
    <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
    <a href="${verifyUrl}" style="display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">Verify Email</a>
    <p>Or copy this link: ${verifyUrl}</p>
    <p>This link expires in 24 hours.</p>
    <p>If you didn't create an account, please ignore this email.</p>
  </div>
`;

const resetPasswordEmail = (name, resetUrl) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #4f46e5;">Password Reset Request</h2>
    <p>Hi ${name},</p>
    <p>You requested a password reset. Click the button below to set a new password:</p>
    <a href="${resetUrl}" style="display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">Reset Password</a>
    <p>Or copy this link: ${resetUrl}</p>
    <p>This link expires in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
  </div>
`;

const composeEmailHtml = (senderName, message) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <p><strong>From:</strong> ${senderName}</p>
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
    <div style="white-space: pre-wrap;">${message}</div>
  </div>
`;

module.exports = { verificationEmail, resetPasswordEmail, composeEmailHtml };
