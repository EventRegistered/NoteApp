require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  corsOrigin: process.env.CORS_ORIGIN || '*',
  jsonLimit: process.env.JSON_LIMIT || '10kb',
  db: {
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'notes',
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASS || '',
    poolMax: Number(process.env.DB_POOL_MAX || 10),
    logging: process.env.DB_LOGGING === 'true',
  },
};