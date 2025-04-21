const express = require('express');
const router = express.Router();
const db = require('../../db');
router.get('/frames', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM frames');
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching frames:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ 
      error: 'Failed to retrieve frames',
      details: err.message,
      stack: err.stack
    });
  }
});

module.exports = router;