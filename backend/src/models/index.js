const sequelize = require('../config/db');
const User = require('./User');
const Note = require('./Note');

// Associations
User.hasMany(Note, { foreignKey: 'UserId', onDelete: 'CASCADE' });
Note.belongsTo(User, { foreignKey: 'UserId' });

async function syncModels() {
  try {
    await sequelize.authenticate();
    console.log('DB connection established');
    await sequelize.sync({ alter: true });
    console.log('Models synchronized');
    process.exit(0);
  } catch (err) {
    console.error('Failed to sync models:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  syncModels();
}

module.exports = { sequelize, User, Note };