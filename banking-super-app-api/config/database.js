const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'), // Файл БД будет создан в корне
  logging: false // Отключаем спам SQL-запросов в консоль
});

module.exports = sequelize;