const Account = require('../models/Account');

const accountsService = {
  async getUserAccounts(userId) {
    return await Account.findAll({ where: { userId } });
  },

  async getAccountById(accountId, userId) {
    const account = await Account.findOne({ where: { id: accountId } });
    
    if (account && account.userId !== userId) {
      const error = new Error('Доступ запрещён');
      error.statusCode = 403;
      throw error;
    }
    return account;
  },
  
  // Внутренний метод для транзакций
  async updateBalance(accountId, newBalance) {
     await Account.update({ balance: newBalance }, { where: { id: accountId } });
  }
};

module.exports = accountsService;