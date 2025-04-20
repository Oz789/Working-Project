const express = require('express');
const router = express.Router();
const db = require('../../db');

// Get all messages sent by a specific user
router.post('/', async (req, res) => {
  const { id, type } = req.body;

  if (!id || !type) {
    return res.status(400).json({ error: "Missing 'id' or 'type' in request body." });
  }

  const sql = `
    SELECT 
      m.id, 
      m.name,
      m.email,
      m.phone,
      m.message, 
      m.subject, 
      m.created_at,
      m.sender_id,
      m.sender_type
    FROM messages m
    WHERE m.sender_id = ? AND m.sender_type = ?
    ORDER BY m.created_at DESC
  `;

  try {
    const [rows] = await db.query(sql, [id, type]);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching sent messages:", err);
    res.status(500).json({
      error: "Server error",
      details: err.message,
      stack: err.stack
    });
  }
});

module.exports = router;
