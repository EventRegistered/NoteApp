require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const xss = require('xss-clean');
const morgan = require('morgan');
const routesFactory = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

/**
 * Create and configure the Express application.
 * No side-effects on import; accepts injected dependencies for testability.
 * @param {Object} deps
 * @param {import('sequelize').Sequelize} deps.db
 * @param {Object} deps.config
 * @returns {import('express').Express}
 */
module.exports = function createApp({ db, config } = {}) {
  const app = express();

  // logging middleware (dev)
  app.use(morgan('dev'));

  app.use(helmet());
  app.use(cors({ origin: process.env.CORS_ORIGIN || config?.corsOrigin || '*' }));
  app.use(express.json());
  app.use(xss());
  app.use(rateLimit({ windowMs: 60 * 1000, max: 200 }));

  // support routes being either a router or a factory that accepts deps
  app.use('/api', routesFactory({ db, config }));

  // health endpoint (already present)
  app.get('/health', (req, res) => res.json({ ok: true, env: process.env.NODE_ENV }));

  app.use(notFound);
  app.use(errorHandler);

  return app;
};