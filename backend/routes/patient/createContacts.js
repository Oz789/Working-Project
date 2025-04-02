const express = require('express');
const router = express.Router();
const db = require('../../db');

// Handle form submission
router.post("/submit-form", (req, res) => {
  //const { firstName, lastName, email, phone, message } = req.body;
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "First name, last name, email, and message are required." });
  }

  //const name = `${firstName} ${lastName}`; // Combine first and last names

  const sql = "INSERT INTO contactus (name, email, phone, message) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, email, phone, message], (err, result) => {
    if (err) {
      console.error("Error inserting data into database:", err);
      return res.status(500).json({ error: "Database error. Please try again later." });
    }
    res.json({ message: "Your message has been submitted successfully!" });
  });
});

module.exports = router;
