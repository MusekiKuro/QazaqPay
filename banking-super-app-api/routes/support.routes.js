// Роуты для поддержки и FAQ
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const supportController = require('../controllers/support.controller');

// POST /api/support/message - Отправить сообщение в поддержку (требует авторизации)
router.post('/message', authMiddleware, supportController.sendMessage);

// GET /api/support/faq - Получить FAQ (без авторизации)
router.get('/faq', supportController.getFAQ);

module.exports = router;
