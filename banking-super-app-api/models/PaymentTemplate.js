// Модель шаблона платежа
class PaymentTemplate {
  constructor({ id, name, category, provider, fields }) {
    this.id = id;
    this.name = name;
    this.category = category; // 'utilities', 'mobile', 'internet', 'other'
    this.provider = provider;
    this.fields = fields || []; // Поля для заполнения
  }
}

module.exports = PaymentTemplate;
