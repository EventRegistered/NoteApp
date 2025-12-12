require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
    // Ensure models are synced in production cautiously; prefer migrations in real-world
    await sequelize.sync();

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    process.on('unhandledRejection', (err) => {
      console.error('Unhandled rejection', err);
      server.close(() => process.exit(1));
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
})();