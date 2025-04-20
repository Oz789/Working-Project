const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get('/eyeContacts', async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const [results] = await connection.query('SELECT * FROM eyecontacts');
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching contacts:', err);
    res.status(500).json({ error: 'Failed to retrieve contacts' });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;

