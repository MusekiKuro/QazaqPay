// Сервис для работы со счетами
const DataManager = require('../utils/dataManager');

const accountsDB = new DataManager('accounts.json');

const accountsService = {
  // Получить все счета пользователя
  async getUserAccounts(userId) {
    const accounts = accountsDB.find(account => account.userId === userId);
    return accounts;
  },

  // Получить конкретный счёт
  async getAccountById(accountId, userId) {
    const account = accountsDB.findById(accountId);
    
    // Проверяем, что счёт принадлежит пользователю
    if (account && account.userId !== userId) {
      const error = new Error('Доступ запрещён');
      error.statusCode = 403;
      throw error;
    }

    return account;
  },

  // Обновить баланс счёта
  async updateBalance(accountId, newBalance) {
    return accountsDB.update(accountId, { balance: newBalance });
  }
};

module.exports = accountsService;
