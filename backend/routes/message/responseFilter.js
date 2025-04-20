const express = require('express');
const router = express.Router();
const db = require('../../db');

// Get messages that have not been responded to by a specific recipient
router.post('/', async (req, res) => {
  const { id, type } = req.body;

  if (!id || !type) {
    return res.status(400).json({ error: 'Missing id or type' });
  }

  const sql = `
    SELECT m.id, m.name, m.email, m.phone, m.subject, m.message, m.created_at, m.sender_id, m.sender_type
    FROM messages m
    JOIN messagerecipients r ON m.id = r.message_id
    WHERE r.recipient_id = ? AND r.recipient_type = ? AND r.has_responded = FALSE
    ORDER BY m.created_at DESC
  `;

  try {
    const [results] = await db.query(sql, [id, type]);
    res.json(results);
  } catch (err) {
    console.error('Error retrieving unresponded messages:', err);
    res.status(500).json({
      error: 'Database error',
      details: err.message,
      stack: err.stack
    });
  }
});

module.exports = router;
