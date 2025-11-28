// Контроллер для работы с транзакциями
const transactionsService = require('../services/transactions.service');

const transactionsController = {
  // Получить историю операций
  async getTransactions(req, res, next) {
    try {
      const userId = req.user.userId;
      const { accountId } = req.query;

      const transactions = await transactionsService.getTransactions(userId, accountId);

      res.status(200).json({
        success: true,
        data: transactions
      });
    } catch (error) {
      next(error);
    }
  },

  // Перевод между счетами
  async transfer(req, res, next) {
    try {
      const userId = req.user.userId;
      const { fromAccountId, toAccountId, amount, description } = req.body;

      // Валидация
      if (!fromAccountId || !toAccountId || !amount) {
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

      const result = await transactionsService.transfer({
        userId,
        fromAccountId,
        toAccountId,
        amount,
        description: description || 'Перевод'
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

module.exports = transactionsController;
