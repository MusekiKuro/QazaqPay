// Роуты для аутентификации
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// POST /api/auth/register - Регистрация
router.post('/register', authController.register);

// POST /api/auth/login - Вход
router.post('/login', authController.login);

// POST /api/auth/mfa/verify - Проверка MFA кода
router.post('/mfa/verify', authController.verifyMFA);

module.exports = router;
