const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Проверка прав администратора
function checkAuth(req, res, next) {
  if (req.session.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Нет доступа' });
  }
}

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM news ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Получить одну новость по ID
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM news WHERE id = $1', [req.params.id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Новость не найдена' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', checkAuth, async (req, res) => {
  const { title, content } = req.body;
  try {
    await pool.query('INSERT INTO news (title, content) VALUES ($1, $2)', [title, content]);
    res.status(201).json({ message: 'Новость добавлена' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Удаление новости
router.delete('/:id', checkAuth, async (req, res) => {
  const newsId = req.params.id;

  try {
    // Удаляем новость из базы данных по id
    await pool.query('DELETE FROM news WHERE id = $1', [newsId]);
    res.json({ message: 'Новость удалена' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Обновление новости
router.put('/:id', checkAuth, async (req, res) => {
  const { title, content } = req.body;
  const newsId = req.params.id;

  try {
    // Обновляем новость в базе данных
    const result = await pool.query(
      'UPDATE news SET title = $1, content = $2 WHERE id = $3',
      [title, content, newsId]
    );

    if (result.rowCount > 0) {
      res.json({ message: 'Новость обновлена' });
    } else {
      res.status(404).json({ message: 'Новость не найдена' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
