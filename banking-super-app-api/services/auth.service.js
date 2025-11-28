// Сервис аутентификации
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const DataManager = require('../utils/dataManager');
const User = require('../models/User');

const usersDB = new DataManager('users.json');

const authService = {
  // Регистрация нового пользователя
  async register({ phone, password, name }) {
    // Проверяем, существует ли пользователь
    const existingUser = usersDB.find(user => user.phone === phone)[0];
    
    if (existingUser) {
      const error = new Error('Пользователь с таким телефоном уже существует');
      error.statusCode = 400;
      throw error;
    }

    // Хэшируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаём пользователя
    const newUser = new User({
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      phone,
      password: hashedPassword,
      name,
      mfaEnabled: true
    });

    // Сохраняем в "базу"
    usersDB.add(newUser);

    // Генерируем токен
    const token = generateToken({
      userId: newUser.id,
      phone: newUser.phone
    });

    return {
      user: newUser.toSafeObject(),
      token
    };
  },

  // Вход пользователя
  async login({ phone, password }) {
    // Находим пользователя
    const user = usersDB.find(u => u.phone === phone)[0];

    if (!user) {
      const error = new Error('Неверный телефон или пароль');
      error.statusCode = 401;
      throw error;
    }

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error = new Error('Неверный телефон или пароль');
      error.statusCode = 401;
      throw error;
    }

    // Если включена MFA, требуем код
    if (user.mfaEnabled) {
      return {
        requiresMFA: true,
        phone: user.phone,
        message: 'Требуется ввод кода подтверждения'
      };
    }

    // Генерируем токен
    const token = generateToken({
      userId: user.id,
      phone: user.phone
    });

    const userObj = new User(user);

    return {
      requiresMFA: false,
      user: userObj.toSafeObject(),
      token
    };
  },

  // Верификация MFA кода
  async verifyMFA({ phone, code }) {
    // Находим пользователя
    const user = usersDB.find(u => u.phone === phone)[0];

    if (!user) {
      const error = new Error('Пользователь не найден');
      error.statusCode = 404;
      throw error;
    }

    // Проверяем код (в демо всегда 123456)
    const validCode = process.env.MFA_CODE || '123456';

    if (code !== validCode) {
      const error = new Error('Неверный код подтверждения');
      error.statusCode = 401;
      throw error;
    }

    // Генерируем токен
    const token = generateToken({
      userId: user.id,
      phone: user.phone
    });

    const userObj = new User(user);

    return {
      verified: true,
      user: userObj.toSafeObject(),
      token
    };
  }
};

module.exports = authService;
