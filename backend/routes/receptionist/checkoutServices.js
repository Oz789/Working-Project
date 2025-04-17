const express = require('express');
const router = express.Router();
const db = require('../../db');

// Services (name, price, id)
router.get('/services', async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      'SELECT serviceID AS itemID, serviceName AS name, price FROM services'
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching services:", err);
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

// Frames
router.get('/frames', async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      'SELECT frameID AS itemID, name, price FROM frames'
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching frames:", err);
    res.status(500).json({ error: "Failed to fetch frames" });
  }
});

// Eye Contacts
router.get('/contacts', async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      'SELECT contactID AS itemID, name, price FROM eyecontacts'
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching contacts:", err);
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
});

module.exports = router;
