const jwtUtil = require('../utils/jwt');
const asyncHandler = require('express-async-handler');
const { User } = require('../models');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ message: 'Not authorized' });

  try {
    const decoded = jwtUtil.verify(token);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = { id: user.UserId, email: user.Email, fullName: user.FullName, role: user.Role };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid' });
  }
});