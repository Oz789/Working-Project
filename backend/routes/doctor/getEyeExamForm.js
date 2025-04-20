const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get('/:appointmentNumber', async (req, res) => {
  const { appointmentNumber } = req.params;

  const sql = `SELECT * FROM EyeExam WHERE appointmentNumber = ? LIMIT 1`;

  try {
    const [rows] = await db.query(sql, [appointmentNumber]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Exam form not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Failed to retrieve exam form:", err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;

