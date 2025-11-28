// Сервис поддержки
const DataManager = require('../utils/dataManager');
const SupportMessage = require('../models/SupportMessage');

const supportDB = new DataManager('supportMessages.json');
const faqDB = new DataManager('faq.json');

const supportService = {
  // Создать сообщение в поддержку
  async createMessage({ userId, subject, message }) {
    const supportMessage = new SupportMessage({
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      subject,
      message,
      status: 'new'
    });

    supportDB.add(supportMessage);

    return supportMessage;
  },

  // Получить FAQ
  async getFAQ() {
    return faqDB.read();
  }
};

module.exports = supportService;
