// Роуты для работы с транзакциями
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const transactionsController = require('../controllers/transactions.controller');

// Все роуты защищены авторизацией
router.use(authMiddleware);

// GET /api/transactions - Получить историю операций
router.get('/', transactionsController.getTransactions);

// POST /api/transactions/transfer - Перевод между счетами
router.post('/transfer', transactionsController.transfer);

module.exports = router;
