const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const jwtUtil = require('../utils/jwt');

exports.register = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!email || !password || !fullName) return res.status(400).json({ message: 'Missing fields' });

  const existing = await User.findOne({ where: { Email: email.toLowerCase() } });
  if (existing) return res.status(409).json({ message: 'Email already in use' });

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ FullName: fullName, Email: email.toLowerCase(), PasswordHash: hash });

  const token = jwtUtil.sign({ id: user.UserId, email: user.Email });
  res.status(201).json({ success: true, data: { user: { UserId: user.UserId, Email: user.Email, FullName: user.FullName }, token } });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

  const user = await User.findOne({ where: { Email: email.toLowerCase() } });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await user.verifyPassword(password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwtUtil.sign({ id: user.UserId, email: user.Email });
  res.json({ success: true, data: { user: { UserId: user.UserId, Email: user.Email, FullName: user.FullName }, token } });
});