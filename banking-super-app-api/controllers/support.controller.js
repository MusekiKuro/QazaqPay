// Контроллер для поддержки
const supportService = require('../services/support.service');

const supportController = {
  // Отправить сообщение в поддержку
  async sendMessage(req, res, next) {
    try {
      const userId = req.user.userId;
      const { subject, message } = req.body;

      // Валидация
      if (!subject || !message) {
        return res.status(400).json({
          success: false,
          message: 'Заполните тему и текст сообщения'
        });
      }

      const result = await supportService.createMessage({
        userId,
        subject,
        message
      });

      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  // Получить FAQ
  async getFAQ(req, res, next) {
    try {
      const faq = await supportService.getFAQ();

      res.status(200).json({
        success: true,
        data: faq
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = supportController;
