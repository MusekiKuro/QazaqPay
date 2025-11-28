// Утилита для работы с JSON файлами (имитация БД)
const fs = require('fs');
const path = require('path');

class DataManager {
  constructor(filename) {
    this.filepath = path.join(__dirname, '../data', filename);
  }

  // Чтение данных
  read() {
    try {
      const data = fs.readFileSync(this.filepath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Ошибка чтения ${this.filepath}:`, error);
      return [];
    }
  }

  // Запись данных
  write(data) {
    try {
      fs.writeFileSync(this.filepath, JSON.stringify(data, null, 2), 'utf8');
      return true;
    } catch (error) {
      console.error(`Ошибка записи ${this.filepath}:`, error);
      return false;
    }
  }

  // Поиск по ID
  findById(id) {
    const data = this.read();
    return data.find(item => item.id === id);
  }

  // Поиск по условию
  find(predicate) {
    const data = this.read();
    return data.filter(predicate);
  }

  // Добавление записи
  add(item) {
    const data = this.read();
    data.push(item);
    this.write(data);
    return item;
  }

  // Обновление записи
  update(id, updates) {
    const data = this.read();
    const index = data.findIndex(item => item.id === id);
    
    if (index !== -1) {
      data[index] = { ...data[index], ...updates };
      this.write(data);
      return data[index];
    }
    
    return null;
  }

  // Удаление записи
  delete(id) {
    const data = this.read();
    const filtered = data.filter(item => item.id !== id);
    this.write(filtered);
    return filtered.length < data.length;
  }
}

module.exports = DataManager;
