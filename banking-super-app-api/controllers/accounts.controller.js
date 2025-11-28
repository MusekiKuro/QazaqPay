// Контроллер для работы со счетами
const accountsService = require('../services/accounts.service');

const accountsController = {
  // Получить все счета пользователя
  async getAccounts(req, res, next) {
    try {
      const userId = req.user.userId;
      const accounts = await accountsService.getUserAccounts(userId);

      res.status(200).json({
        success: true,
        data: accounts
      });
    } catch (error) {
      next(error);
    }
  },

  // Получить конкретный счёт
  async getAccountById(req, res, next) {
    try {
      const userId = req.user.userId;
      const accountId = req.params.id;

      const account = await accountsService.getAccountById(accountId, userId);

      if (!account) {
        return res.status(404).json({
          success: false,
          message: 'Счёт не найден'
        });
      }

      res.status(200).json({
        success: true,
        data: account
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = accountsController;
