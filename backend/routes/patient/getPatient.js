const express = require('express');
const router = express.Router();
const db = require('../../db');

// Add your patients route here
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT patientID, firstName, lastName, email FROM patient');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching patients:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 