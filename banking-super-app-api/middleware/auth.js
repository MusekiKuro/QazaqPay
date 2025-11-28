// Middleware для проверки JWT токена
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Получаем токен из заголовка Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Токен не предоставлен'
      });
    }

    // Извлекаем токен (формат: "Bearer TOKEN")
    const token = authHeader.split(' ')[1];

    // Верифицируем токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Добавляем данные пользователя в req объект
    req.user = {
      userId: decoded.userId,
      phone: decoded.phone
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Токен истёк'
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Невалидный токен'
    });
  }
};

module.exports = authMiddleware;
