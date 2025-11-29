const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4, // Автоматический ID
    primaryKey: true
  },
  phone: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING
  },
  mfaEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

// Метод для удаления пароля при отправке на фронт
User.prototype.toSafeObject = function() {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

module.exports = User;