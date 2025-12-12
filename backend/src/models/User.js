const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  UserId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  FullName: { type: DataTypes.STRING(150), allowNull: false },
  Email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  PasswordHash: { type: DataTypes.STRING(255), allowNull: false },
  Role: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'user' }
});

User.prototype.verifyPassword = function (password) {
  return bcrypt.compare(password, this.PasswordHash);
};

module.exports = User;