require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const xss = require('xss-clean');
const morgan = require('morgan');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '10kb' }));
app.use(xss());
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

const limiter = rateLimit({ windowMs: 1 * 60 * 1000, max: 120, message: { message: 'Too many requests' } });
app.use(limiter);

app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;