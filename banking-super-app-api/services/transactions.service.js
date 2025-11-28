// Сервис для работы с транзакциями
const DataManager = require('../utils/dataManager');
const Transaction = require('../models/Transaction');
const accountsService = require('./accounts.service');

const transactionsDB = new DataManager('transactions.json');
const accountsDB = new DataManager('accounts.json');

const transactionsService = {
  // Получить историю операций
  async getTransactions(userId, accountId = null) {
    // Получаем все счета пользователя
    const userAccounts = await accountsService.getUserAccounts(userId);
    const userAccountIds = userAccounts.map(acc => acc.id);

    // Фильтруем транзакции
    let transactions = transactionsDB.find(tx => 
      userAccountIds.includes(tx.accountId)
    );

    // Если указан конкретный счёт
    if (accountId) {
      // Проверяем, что счёт принадлежит пользователю
      if (!userAccountIds.includes(accountId)) {
        const error = new Error('Доступ запрещён');
        error.statusCode = 403;
        throw error;
      }

      transactions = transactions.filter(tx => tx.accountId === accountId);
    }

    // Сортируем по дате (новые первые)
    transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return transactions;
  },

  // Создать перевод
  async transfer({ userId, fromAccountId, toAccountId, amount, description }) {
    // Проверяем счёт отправителя
    const fromAccount = await accountsService.getAccountById(fromAccountId, userId);

    if (!fromAccount) {
      const error = new Error('Счёт отправителя не найден');
      error.statusCode = 404;
      throw error;
    }

    // Проверяем баланс
    if (fromAccount.balance < amount) {
      const error = new Error('Недостаточно средств на счёте');
      error.statusCode = 400;
      throw error;
    }

    // Проверяем счёт получателя
    const toAccount = accountsDB.findById(toAccountId);

    if (!toAccount) {
      const error = new Error('Счёт получателя не найден');
      error.statusCode = 404;
      throw error;
    }

    // Проверяем валюты
    if (fromAccount.currency !== toAccount.currency) {
      const error = new Error('Валюты счетов не совпадают');
      error.statusCode = 400;
      throw error;
    }

    // Обновляем балансы
    const newFromBalance = fromAccount.balance - amount;
    const newToBalance = toAccount.balance + amount;

    await accountsService.updateBalance(fromAccountId, newFromBalance);
    accountsDB.update(toAccountId, { balance: newToBalance });

    // Создаём транзакцию для отправителя (расход)
    const outgoingTransaction = new Transaction({
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      accountId: fromAccountId,
      type: 'expense',
      amount: -amount,
      currency: fromAccount.currency,
      category: 'transfer',
      description: `${description} → ${toAccount.maskedCard || toAccount.id}`,
      status: 'success',
      relatedAccountId: toAccountId
    });

    transactionsDB.add(outgoingTransaction);

    // Создаём транзакцию для получателя (приход)
    const incomingTransaction = new Transaction({
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      accountId: toAccountId,
      type: 'income',
      amount: amount,
      currency: toAccount.currency,
      category: 'transfer',
      description: `${description} ← ${fromAccount.maskedCard || fromAccount.id}`,
      status: 'success',
      relatedAccountId: fromAccountId
    });

    transactionsDB.add(incomingTransaction);

    // Получаем обновлённые счета
    const updatedFromAccount = accountsDB.findById(fromAccountId);
    const updatedToAccount = accountsDB.findById(toAccountId);

    return {
      transaction: outgoingTransaction,
      fromAccount: updatedFromAccount,
      toAccount: updatedToAccount
    };
  }
};

module.exports = transactionsService;
