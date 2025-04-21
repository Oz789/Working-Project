const express = require("express");
const router = express.Router();
const db = require("../../db"); 

// Get all doctors
router.get("/doctors", async (req, res) => {
  const sql = `
    SELECT d.*, e.firstName, e.lastName, e.email
    FROM Doctors d
    JOIN Employee e ON d.employeeID = e.employeeID
  `;

  try {
    const [result] = await db.query(sql);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).json({ message: "Error fetching doctors from database." });
  }
});

// Get doctor by ID
router.get("/doctors/:id", async (req, res) => {
  const doctorID = req.params.id;

  const sql = `
    SELECT d.*, e.firstName, e.lastName, e.email
    FROM Doctors d
    JOIN Employee e ON d.employeeID = e.employeeID
    WHERE d.doctorID = ?
  `;

  try {
    const [results] = await db.query(sql, [doctorID]);

    if (results.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(results[0]);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;

