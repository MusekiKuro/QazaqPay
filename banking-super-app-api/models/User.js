// Модель пользователя
class User {
  constructor({ id, phone, password, name, createdAt, mfaEnabled = false }) {
    this.id = id;
    this.phone = phone;
    this.password = password;
    this.name = name;
    this.mfaEnabled = mfaEnabled;
    this.createdAt = createdAt || new Date().toISOString();
  }

  // Безопасное представление (без пароля)
  toSafeObject() {
    return {
      id: this.id,
      phone: this.phone,
      name: this.name,
      mfaEnabled: this.mfaEnabled,
      createdAt: this.createdAt
    };
  }
}

module.exports = User;
