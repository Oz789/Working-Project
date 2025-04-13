// routes/appointments/getClinicAppointments.js
const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get("/clinicAppointments/:locationID", async (req, res) => {
  const { locationID } = req.params;

  const sql = `
    SELECT a.*, 
           p.firstName AS patientFirstName, p.lastName AS patientLastName,
           e.firstName AS doctorFirstName, e.lastName AS doctorLastName
    FROM appointments a
    JOIN patient p ON a.patientID = p.patientID
    JOIN doctors d ON a.doctorID = d.doctorID
    JOIN employee e ON d.employeeID = e.employeeID
    WHERE a.locationID = ?
  `;

  try {
    const [rows] = await db.promise().query(sql, [locationID]);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching appointments by location:", err);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

module.exports = router;
