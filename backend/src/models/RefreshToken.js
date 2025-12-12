const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RefreshToken = sequelize.define('RefreshToken', {
  TokenId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Token: {
    type: DataTypes.STRING(500),
    allowNull: false,
    unique: true
  },
  ExpiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  CreatedByIp: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  RevokedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  ReplacedByToken: {
    type: DataTypes.STRING(500),
    allowNull: true
  }
}, {
  tableName: 'RefreshTokens',
  timestamps: true
});

RefreshToken.prototype.isExpired = function() {
  return new Date() >= this.ExpiresAt;
};

RefreshToken.prototype.isRevoked = function() {
  return this.RevokedAt !== null;
};

RefreshToken.prototype.isActive = function() {
  return !this.isRevoked() && !this.isExpired();
};

module.exports = RefreshToken;
