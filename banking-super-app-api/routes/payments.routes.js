// Роуты для работы с платежами
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const paymentsController = require('../controllers/payments.controller');

// Все роуты защищены авторизацией
router.use(authMiddleware);

// GET /api/payments/templates - Получить шаблоны платежей
router.get('/templates', paymentsController.getTemplates);

// POST /api/payments/pay - Оплатить услугу
router.post('/pay', paymentsController.pay);

module.exports = router;
