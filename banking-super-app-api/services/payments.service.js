// Сервис для работы с платежами
const DataManager = require('../utils/dataManager');
const Transaction = require('../models/Transaction');
const accountsService = require('./accounts.service');

const paymentsDB = new DataManager('paymentTemplates.json');
const transactionsDB = new DataManager('transactions.json');

const paymentsService = {
  // Получить шаблоны платежей
  async getTemplates() {
    return paymentsDB.read();
  },

  // Оплатить услугу
  async pay({ userId, fromAccountId, templateId, amount, details }) {
    // Проверяем счёт
    const account = await accountsService.getAccountById(fromAccountId, userId);

    if (!account) {
      const error = new Error('Счёт не найден');
      error.statusCode = 404;
      throw error;
    }

    // Проверяем баланс
    if (account.balance < amount) {
      const error = new Error('Недостаточно средств на счёте');
      error.statusCode = 400;
      throw error;
    }

    // Проверяем шаблон
    const template = paymentsDB.findById(templateId);

    if (!template) {
      const error = new Error('Шаблон платежа не найден');
      error.statusCode = 404;
      throw error;
    }

    // Обновляем баланс
    const newBalance = account.balance - amount;
    await accountsService.updateBalance(fromAccountId, newBalance);

    // Создаём транзакцию
    const transaction = new Transaction({
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      accountId: fromAccountId,
      type: 'expense',
      amount: -amount,
      currency: account.currency,
      category: template.category,
      description: `Оплата: ${template.name} (${template.provider})`,
      status: 'success'
    });

    transactionsDB.add(transaction);

    // Получаем обновлённый счёт
    const updatedAccount = await accountsService.getAccountById(fromAccountId, userId);

    return {
      transaction,
      account: updatedAccount,
      template
    };
  }
};

module.exports = paymentsService;
