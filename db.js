const { Pool } = require('pg');

// Настройки подключения к PostgreSQL
const pool = new Pool({
  user: 'postgres', // имя пользователя
  host: 'localhost', // хост
  database: 'iknt', // имя базы данных
  password: '12345', // пароль
  port: 5432, // порт, обычно 5432
});

module.exports = pool;
