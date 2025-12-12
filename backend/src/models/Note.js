const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Note = sequelize.define('Note', {
  NoteId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  UserId: { type: DataTypes.INTEGER, allowNull: false },
  Title: { type: DataTypes.STRING(255), allowNull: false },
  Content: { type: DataTypes.TEXT, allowNull: true },
  Deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  DeletedAt: { type: DataTypes.DATE, allowNull: true }
});

module.exports = Note;