const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const { User, RefreshToken } = require('../models');
const jwtUtil = require('../utils/jwt');

const getClientIp = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || null;
};

const generateTokens = async (user, ip) => {
  const accessToken = jwtUtil.sign({ id: user.UserId, email: user.Email });
  const refreshTokenValue = jwtUtil.generateRefreshToken();
  
  await RefreshToken.create({
    UserId: user.UserId,
    Token: refreshTokenValue,
    ExpiresAt: jwtUtil.getRefreshTokenExpiry(),
    CreatedByIp: ip
  });

  return { accessToken, refreshToken: refreshTokenValue };
};

exports.register = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  const existing = await User.findOne({ where: { Email: email } });
  if (existing) return res.status(409).json({ success: false, message: 'Email already in use' });

  const hash = await bcrypt.hash(password, 12);
  const user = await User.create({ FullName: fullName, Email: email, PasswordHash: hash });

  const ip = getClientIp(req);
  const tokens = await generateTokens(user, ip);

  res.status(201).json({ 
    success: true, 
    data: { 
      user: { UserId: user.UserId, Email: user.Email, FullName: user.FullName }, 
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken
    } 
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { Email: email } });
  if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

  const ok = await user.verifyPassword(password);
  if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' });

  const ip = getClientIp(req);
  const tokens = await generateTokens(user, ip);

  res.json({ 
    success: true, 
    data: { 
      user: { UserId: user.UserId, Email: user.Email, FullName: user.FullName }, 
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken
    } 
  });
});

exports.refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  
  const storedToken = await RefreshToken.findOne({ 
    where: { Token: refreshToken },
    include: [{ model: User }]
  });

  if (!storedToken) {
    return res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }

  if (!storedToken.isActive()) {
    return res.status(401).json({ success: false, message: 'Refresh token expired or revoked' });
  }

  const ip = getClientIp(req);
  const newRefreshToken = jwtUtil.generateRefreshToken();
  
  storedToken.RevokedAt = new Date();
  storedToken.ReplacedByToken = newRefreshToken;
  await storedToken.save();

  await RefreshToken.create({
    UserId: storedToken.UserId,
    Token: newRefreshToken,
    ExpiresAt: jwtUtil.getRefreshTokenExpiry(),
    CreatedByIp: ip
  });

  const accessToken = jwtUtil.sign({ id: storedToken.User.UserId, email: storedToken.User.Email });

  res.json({
    success: true,
    data: {
      token: accessToken,
      refreshToken: newRefreshToken
    }
  });
});

exports.logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  
  if (refreshToken) {
    const storedToken = await RefreshToken.findOne({ where: { Token: refreshToken } });
    if (storedToken) {
      storedToken.RevokedAt = new Date();
      await storedToken.save();
    }
  }

  res.json({ success: true, message: 'Logged out successfully' });
});

exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: ['UserId', 'Email', 'FullName', 'Role', 'createdAt']
  });
  
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.json({ success: true, data: { user } });
});
