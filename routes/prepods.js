const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function checkAuth(req, res, next) {
  if (req.session.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Нет доступа' });
  }
}

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM prepods ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', checkAuth, async (req, res) => {
  const { name, position, bio, photo } = req.body;
  try {
    await pool.query(
      'INSERT INTO prepods (name, position, bio, photo) VALUES ($1, $2, $3, $4)',
      [name, position, bio, photo]
    );
    res.status(201).json({ message: 'Преподаватель добавлен' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM prepods WHERE id = $1', [req.params.id]);
    res.json({ message: 'Преподаватель удален' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Обновление преподавателя
router.put('/:id', checkAuth, async (req, res) => {
  const { name, position, bio } = req.body;
  const id = req.params.id;

  try {
    const result = await pool.query(
      'UPDATE prepods SET name = $1, position = $2, bio = $3 WHERE id = $4',
      [name, position, bio, id]
    );

    if (result.rowCount > 0) {
      res.json({ message: 'Преподаватель обновлен' });
    } else {
      res.status(404).json({ message: 'Преподаватель не найден' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
