const express = require('express');
const router = express.Router();
const db = require('../../db');

// Mark a message as responded
router.post('/', async (req, res) => {
  const { messageId, recipientId, recipientType } = req.body;

  if (!messageId || !recipientId || !recipientType) {
    return res.status(400).json({ error: "Missing required fields in request body." });
  }

  const sql = `
    UPDATE messagerecipients
    SET has_responded = 1
    WHERE message_id = ? AND recipient_id = ? AND recipient_type = ?
  `;

  try {
    const [result] = await db.query(sql, [messageId, recipientId, recipientType]);
    res.json({ success: true, affectedRows: result.affectedRows });
  } catch (err) {
    console.error("❌ Error updating has_responded:", err);
    res.status(500).json({
      error: "Database error",
      details: err.message,
      stack: err.stack,
    });
  }
});

module.exports = router;
