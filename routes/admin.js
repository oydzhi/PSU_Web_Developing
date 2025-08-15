const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const ADMIN_LOGIN = 'admin';
const ADMIN_PASSWORD_HASH = '$2b$10$3NdpJQ/ZY0r3rxE8q6xHeuUv1snl3D0rO1UMqClH/nCA8LeZk5YCW'; // хеш от "12345"

router.post('/login', async (req, res) => {
  const { login, password } = req.body;

  if (login === ADMIN_LOGIN && await bcrypt.compare(password, ADMIN_PASSWORD_HASH)) {
    req.session.isAdmin = true;
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Неверный логин или пароль' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

router.get('/check', (req, res) => {
  res.json({ isAdmin: req.session.isAdmin || false });
});

module.exports = router;
