const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const User = require('../models/User');
const Account = require('../models/Account'); // Для создания счета при регистрации

const authService = {
  async register({ phone, password, name }) {
    // Проверка существования
    const existingUser = await User.findOne({ where: { phone } });
    if (existingUser) {
      const error = new Error('Пользователь уже существует');
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаем юзера
    const newUser = await User.create({
      phone,
      password: hashedPassword,
      name,
      mfaEnabled: true
    });

    // БОНУС: Создаем ему сразу счет и карту при регистрации!
    await Account.create({
      userId: newUser.id,
      type: 'card',
      currency: 'KZT',
      balance: 50000, // Приветственный бонус для теста
      cardNumber: '4400' + Math.floor(Math.random() * 1000000000000),
      maskedCard: '**** ' + Math.floor(1000 + Math.random() * 9000)
    });

    const token = generateToken({ userId: newUser.id, phone: newUser.phone });

    return {
      user: newUser.toSafeObject(),
      token
    };
  },

  async login({ phone, password }) {
    const user = await User.findOne({ where: { phone } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      const error = new Error('Неверный телефон или пароль');
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken({ userId: user.id, phone: user.phone });

    return {
      requiresMFA: false, // Упростили для скорости, можно вернуть true позже
      user: user.toSafeObject(),
      token
    };
  },
  
  async verifyMFA({ phone, code }) {
      // Логика MFA остается такой же, только поиск через User.findOne
      // Для хакатона можно оставить как заглушку в контроллере или упростить
      const user = await User.findOne({ where: { phone } });
      if (!user) throw new Error('User not found');
      
      const token = generateToken({ userId: user.id, phone: user.phone });
      return { verified: true, user: user.toSafeObject(), token };
  }
};

module.exports = authService;