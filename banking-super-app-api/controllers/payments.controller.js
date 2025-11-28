// Контроллер для работы с платежами
const paymentsService = require('../services/payments.service');

const paymentsController = {
  // Получить шаблоны платежей
  async getTemplates(req, res, next) {
    try {
      const templates = await paymentsService.getTemplates();

      res.status(200).json({
        success: true,
        data: templates
      });
    } catch (error) {
      next(error);
    }
  },

  // Оплатить услугу
  async pay(req, res, next) {
    try {
      const userId = req.user.userId;
      const { fromAccountId, templateId, amount, details } = req.body;

      // Валидация
      if (!fromAccountId || !templateId || !amount) {
        return res.status(400).json({
          success: false,
          message: 'Заполните все обязательные поля'
        });
      }

      if (amount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Сумма должна быть больше нуля'
        });
      }

      const result = await paymentsService.pay({
        userId,
        fromAccountId,
        templateId,
        amount,
        details: details || {}
      });

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = paymentsController;
