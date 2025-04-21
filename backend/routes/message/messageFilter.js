const express = require('express');
const router = express.Router();
const db = require('../../db');

// POST - Get messages for a specific recipient
router.post('/', async (req, res) => {
  const { id, type } = req.body;

  if (!id || !type) {
    return res.status(400).json({ error: "Missing 'id' or 'type' in request body." });
  }

  const sql = `
    SELECT m.id, m.name, m.email, m.phone, m.subject, m.message, m.created_at, m.sender_id, m.sender_type
    FROM messages m
    JOIN messagerecipients r ON m.id = r.message_id
    WHERE r.recipient_id = ? AND r.recipient_type = ?
    ORDER BY m.created_at DESC
  `;

  try {
    const [results] = await db.query(sql, [id, type]);
    res.json(results);
  } catch (err) {
    console.error("❌ Error retrieving messages for recipient:", err);
    res.status(500).json({
      error: "Database error",
      details: err.message,
      stack: err.stack,
    });
  }
});

module.exports = router;
