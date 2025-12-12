const jwt = require('jsonwebtoken');

const sign = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
};

const verify = (token) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = { sign, verify };