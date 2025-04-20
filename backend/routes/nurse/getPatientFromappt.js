const express = require("express");
const router = express.Router();
const db = require("../../db");


router.get('/:appointmentNumber', async (req, res) => {
  const { appointmentNumber } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT patientID FROM appointments WHERE appointmentNumber = ?`,
      [appointmentNumber]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Error fetching patientID by appointmentNumber:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
