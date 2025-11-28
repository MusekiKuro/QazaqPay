// Модель сообщения в поддержку
class SupportMessage {
  constructor({ id, userId, subject, message, status = 'new', createdAt }) {
    this.id = id;
    this.userId = userId;
    this.subject = subject;
    this.message = message;
    this.status = status; // 'new', 'in_progress', 'resolved'
    this.createdAt = createdAt || new Date().toISOString();
  }
}

module.exports = SupportMessage;
