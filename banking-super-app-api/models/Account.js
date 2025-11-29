const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Account = sequelize.define('Account', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING, // 'card', 'savings'
    defaultValue: 'card'
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'KZT'
  },
  balance: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00
  },
  cardNumber: {
    type: DataTypes.STRING
  },
  maskedCard: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active'
  }
});

// Связи (опционально, но полезно)
// Account.belongsTo(User, { foreignKey: 'userId' });

module.exports = Account;