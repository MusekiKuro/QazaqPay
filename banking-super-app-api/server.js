require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/database');

// Импортируем модели для регистрации в Sequelize
require('./models/User');
require('./models/Account');
require('./models/Transaction');

const PORT = process.env.PORT || 3000;

// Синхронизация БД
// force: false означает "не удалять данные при перезапуске"
sequelize.sync({ force: false }).then(() => {
  console.log('✅ База данных SQLite подключена и синхронизирована');
  
  app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
    console.log(`📱 API доступен по адресу: http://localhost:${PORT}/api`);
  });
}).catch(err => {
  console.error('❌ Ошибка подключения к БД:', err);
});