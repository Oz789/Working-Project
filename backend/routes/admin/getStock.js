
const express = require('express');
const router = express.Router();
const db = require('../../db');


router.get('/frames/:frameID', async (req, res) => {
  const { frameID } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT stockCount FROM frames WHERE frameID = ?`,
      [frameID]
    );

    if (rows.length === 0) return res.status(404).json({ stockCount: 0 });

    res.json({ stockCount: rows[0].stockCount });
  } catch (err) {
    console.error("Error fetching frame stock:", err);
    res.status(500).json({ error: 'Failed to fetch frame stock' });
  }
});


router.get('/contacts/:contactID', async (req, res) => {
  const { contactID } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT stockCount FROM eyeContacts WHERE contactID = ?`,
      [contactID]
    );

    if (rows.length === 0) return res.status(404).json({ stockCount: 0 });

    res.json({ stockCount: rows[0].stockCount });
  } catch (err) {
    console.error("Error fetching contact stock:", err);
    res.status(500).json({ error: 'Failed to fetch contact stock' });
  }
});

module.exports = router;