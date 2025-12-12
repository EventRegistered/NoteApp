const { Router } = require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');

const registerSchema = Joi.object({
  fullName: Joi.string().max(255).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = ({ db } = {}) => {
  const router = Router();
  const User = db?.models?.User;
  if (!User) {
    router.use((req, res) => res.status(500).json({ message: 'User model not available' }));
    return router;
  }

  // helper to normalise returned user shape
  const normalizeUser = (u) => {
    const d = u.get ? u.get({ plain: true }) : u;
    return {
      id: d.id ?? d.ID ?? d.Id,
      fullName: d.fullName ?? d.FullName ?? d.Full_Name ?? null,
      email: d.email ?? d.Email ?? null,
    };
  };

  router.post(
    '/register',
    asyncHandler(async (req, res) => {
      const { error, value } = registerSchema.validate(req.body);
      if (error) return res.status(400).json({ message: error.message });

      // try both possible column names when checking existence
      const exists = await User.findOne({
        where: { Email: value.email.toLowerCase() },
      });
      if (exists) return res.status(409).json({ message: 'Email already registered' });

      const hash = await bcrypt.hash(value.password, 10);

      // use DB column names expected by your model (adjust if model differs)
      const created = await User.create({
        FullName: value.fullName,
        Email: value.email.toLowerCase(),
        PasswordHash: hash,
      });

      const safeUser = normalizeUser(created);

      const token = jwt.sign({ id: safeUser.id, email: safeUser.email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
      });

      return res.status(201).json({
        data: {
          user: safeUser,
          token,
        },
      });
    })
  );

  router.post(
    '/login',
    asyncHandler(async (req, res) => {
      const { error, value } = loginSchema.validate(req.body);
      if (error) return res.status(400).json({ message: error.message });

      const user = await User.findOne({ where: { Email: value.email.toLowerCase() } });
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });

      const plainHash = user.get ? (user.PasswordHash ?? user.dataValues?.PasswordHash) : user.PasswordHash;
      const ok = await bcrypt.compare(value.password, plainHash);
      if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

      const safeUser = normalizeUser(user);
      const token = jwt.sign({ id: safeUser.id, email: safeUser.email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
      });

      return res.json({
        data: { user: safeUser, token },
      });
    })
  );

  const requireAuth = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });
    const token = authHeader.split(' ')[1];
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const current = await User.findByPk(payload.id);
      if (!current) return res.status(401).json({ message: 'Unauthorized' });
      req.currentUser = current;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  });

  router.get('/me', requireAuth, (req, res) => {
    const u = req.currentUser;
    return res.json({ data: { user: normalizeUser(u) } });
  });

  return router;
};