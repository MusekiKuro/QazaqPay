// Модель транзакции
class Transaction {
  constructor({ 
    id, 
    accountId, 
    type, 
    amount, 
    currency,
    category,
    description,
    status = 'success',
    relatedAccountId = null,
    createdAt 
  }) {
    this.id = id;
    this.accountId = accountId;
    this.type = type; // 'income', 'expense', 'transfer'
    this.amount = amount;
    this.currency = currency;
    this.category = category;
    this.description = description;
    this.status = status; // 'success', 'pending', 'failed'
    this.relatedAccountId = relatedAccountId;
    this.createdAt = createdAt || new Date().toISOString();
  }
}

module.exports = Transaction;
