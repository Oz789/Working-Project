const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get('/:patientID', async (req, res) => {
  const { patientID } = req.params;

  try {
    const [rows] = await db.query(`
      SELECT i.*
      FROM insurance i
      JOIN patientForm pf ON i.insuranceID = pf.insuranceID
      WHERE pf.patientID = ?
    `, [patientID]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No insurance found for this patient." });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Error fetching insurance:", err);
    res.status(500).json({ error: "Failed to retrieve insurance." });
  }
});

module.exports = router;
