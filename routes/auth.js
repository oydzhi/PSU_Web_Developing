const express = require('express');
const router = express.Router();

const ADMIN_LOGIN = 'admin';
const ADMIN_PASSWORD = 'admin'; // Без хеширования, пароль в явном виде

router.post('/login', (req, res) => {
  const { login, password } = req.body;

  // Проверяем логин и пароль
  if (login === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    res.json({ message: 'Успешный вход' });
  } else {
    res.status(401).json({ message: 'Неверные данные' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Выход выполнен' });
});

module.exports = router;
