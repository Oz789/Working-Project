const express = require('express');
const router = express.Router();
const db = require('../../db');

// Get all non-admin employees
router.get('/', async (req, res) => {
  try {
    const [results] = await db.query(
      'SELECT employeeID, firstName, lastName, email, role FROM employee WHERE isAdmin = 0'
    );
    res.json(results);
  } catch (err) {
    console.error("❌ Error fetching non-admin employees:", err);
    res.status(500).json({
      error: "Database error",
      details: err.message,
      stack: err.stack
    });
  }
});

module.exports = router;
