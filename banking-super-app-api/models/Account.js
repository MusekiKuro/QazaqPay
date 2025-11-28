// Модель счёта/карты
class Account {
  constructor({ 
    id, 
    userId, 
    type, 
    currency, 
    balance, 
    cardNumber = null, 
    maskedCard = null,
    status = 'active',
    createdAt 
  }) {
    this.id = id;
    this.userId = userId;
    this.type = type; // 'card', 'account', 'savings'
    this.currency = currency;
    this.balance = balance;
    this.cardNumber = cardNumber;
    this.maskedCard = maskedCard || this.maskCard(cardNumber);
    this.status = status;
    this.createdAt = createdAt || new Date().toISOString();
  }

  maskCard(cardNumber) {
    if (!cardNumber) return null;
    return `**** **** **** ${cardNumber.slice(-4)}`;
  }
}

module.exports = Account;
