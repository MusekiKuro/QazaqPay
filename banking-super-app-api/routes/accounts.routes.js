// Роуты для работы со счетами
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const accountsController = require('../controllers/accounts.controller');

// Все роуты защищены авторизацией
router.use(authMiddleware);

// GET /api/accounts - Получить все счета пользователя
router.get('/', accountsController.getAccounts);

// GET /api/accounts/:id - Получить конкретный счёт
router.get('/:id', accountsController.getAccountById);

module.exports = router;
