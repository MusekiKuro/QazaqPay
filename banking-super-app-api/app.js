// Конфигурация Express приложения
const express = require('express');
const cors = require('cors');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

// Импорт роутов
const authRoutes = require('./routes/auth.routes');
const accountsRoutes = require('./routes/accounts.routes');
const transactionsRoutes = require('./routes/transactions.routes');
const paymentsRoutes = require('./routes/payments.routes');
const supportRoutes = require('./routes/support.routes');

const app = express();

// Middleware
app.use(cors()); // CORS для мобильного приложения
app.use(express.json()); // Парсинг JSON
app.use(express.urlencoded({ extended: true }));
app.use(logger); // Логирование запросов

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountsRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/support', supportRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error Handler (должен быть последним)
app.use(errorHandler);

module.exports = app;
