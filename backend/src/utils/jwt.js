const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const sign = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { 
    expiresIn: process.env.JWT_EXPIRES_IN || '15m' 
  });
};

const verify = (token) => jwt.verify(token, process.env.JWT_SECRET);

const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString('hex');
};

const getRefreshTokenExpiry = () => {
  const days = parseInt(process.env.REFRESH_TOKEN_DAYS || '7', 10);
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
};

module.exports = { sign, verify, generateRefreshToken, getRefreshTokenExpiry };
