// Контроллер аутентификации
const authService = require('../services/auth.service');

const authController = {
  // Регистрация пользователя
  async register(req, res, next) {
    try {
      const { phone, password, name } = req.body;

      // Валидация
      if (!phone || !password || !name) {
        return res.status(400).json({
          success: false,
          message: 'Заполните все обязательные поля'
        });
      }

      const result = await authService.register({ phone, password, name });

      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  // Вход пользователя
  async login(req, res, next) {
    try {
      const { phone, password } = req.body;

      // Валидация
      if (!phone || !password) {
        return res.status(400).json({
          success: false,
          message: 'Введите телефон и пароль'
        });
      }

      const result = await authService.login({ phone, password });

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  // Верификация MFA
  async verifyMFA(req, res, next) {
    try {
      const { phone, code } = req.body;

      // Валидация
      if (!phone || !code) {
        return res.status(400).json({
          success: false,
          message: 'Введите телефон и код'
        });
      }

      const result = await authService.verifyMFA({ phone, code });

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;
