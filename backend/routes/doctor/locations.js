const express = require('express');
const router = express.Router();
const db = require('../../db'); // using the promise-based db

router.get('/', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM Location');
    res.json(results);
  } catch (err) {
    console.error('❌ Failed to fetch locations:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

