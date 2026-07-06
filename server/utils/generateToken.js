const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * Generate JWT token and set HTTP-only cookie
 */
const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });

  const cookieExpireDays = parseInt(process.env.JWT_COOKIE_EXPIRE, 10) || 7;

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: cookieExpireDays * 24 * 60 * 60 * 1000,
  });

  return token;
};

/**
 * Generate random token for password reset / email verification
 */
const generateRandomToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Hash token for storage
 */
const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

module.exports = { generateToken, generateRandomToken, hashToken };
