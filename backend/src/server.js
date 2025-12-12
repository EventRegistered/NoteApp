require('dotenv').config();

const maybeAppFactory = require('./app');
const maybeCreateDb = require('./models');

// normalize possible exports from ./models:
// - module.exports = async function createDb(...) { ... }
// - module.exports = { createDb: async (...) => ... }
// - module.exports = sequelizeInstance  (already initialized)
// - module.exports = { sequelize, User, Note } (current project shape)
let createDb;
if (typeof maybeCreateDb === 'function') {
  createDb = maybeCreateDb;
} else if (maybeCreateDb && typeof maybeCreateDb === 'object') {
  // already-initialized sequelize instance exported as `sequelize`
  if (maybeCreateDb.sequelize && typeof maybeCreateDb.sequelize.authenticate === 'function') {
    createDb = async () => maybeCreateDb.sequelize;
  } else if (typeof maybeCreateDb.createDb === 'function') {
    createDb = maybeCreateDb.createDb;
  } else if (typeof maybeCreateDb.default === 'function') {
    createDb = maybeCreateDb.default;
  } else if (maybeCreateDb.default && maybeCreateDb.default.sequelize) {
    createDb = async () => maybeCreateDb.default.sequelize;
  } else {
    console.error('Unexpected ./models export keys:', Object.keys(maybeCreateDb));
    throw new TypeError('createDb not found in ./models');
  }
} else {
  throw new TypeError('Invalid export from ./models');
}

const config = require('./config');

const PORT = Number(process.env.PORT || config.port || 4000);

// support app modules that export either a factory function or an already-created app
const createApp = typeof maybeAppFactory === 'function' ? maybeAppFactory : () => maybeAppFactory;

let server;
let sequelize;
let shuttingDown = false;

async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.info(`Shutting down (signal: ${signal})`);
  try {
    if (server && server.close) {
      await new Promise((resolve) => server.close(resolve));
      console.info('HTTP server closed');
    }
  } catch (err) {
    console.error('Error closing HTTP server', err);
  }

  try {
    if (sequelize && typeof sequelize.close === 'function') {
      await sequelize.close();
      console.info('Database connection closed');
    }
  } catch (err) {
    console.error('Error closing DB connection', err);
  }

  setTimeout(() => process.exit(signal === 'uncaughtException' ? 1 : 0), 100);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  shutdown('unhandledRejection');
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  shutdown('uncaughtException');
});

async function bootstrap() {
  try {
    sequelize = await createDb(config.db);
    const app = createApp({ db: sequelize, config });

    if (!app || typeof app.listen !== 'function') {
      throw new TypeError('createApp did not return an Express app (missing app.listen).');
    }

    if (process.env.NODE_ENV && process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
      await sequelize.sync();
      console.info('Database synced (non-production mode)');
    }

    server = app.listen(PORT, () => {
      console.info(`Server running on port ${PORT}`);
    });

    return { server, sequelize, app };
  } catch (err) {
    console.error('Failed to start server', err);
    await shutdown('bootstrapFailure');
    throw err;
  }
}

if (process.env.NODE_ENV !== 'test') {
  bootstrap().catch(() => process.exit(1));
}

module.exports = bootstrap;