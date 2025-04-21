const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get("/clinicAppointmentsDEBUG/:locationID", async (req, res) => {
  const { locationID } = req.params;
  const doctorID = req.query.doctorID;

  console.log("🔥 CONFIRMING: /clinicAppointments/:locationID route is LIVE");

  let sql = `
    SELECT 
      a.appointmentNumber,
      a.appointmentDate,
      a.appointmentTime,
      a.status,
      CAST(a.isReferred AS UNSIGNED) AS isReferred,  -- ✅ confirm this is present
      a.patientID,
      a.doctorID,
      a.locationID,
      p.firstName AS patientFirstName,
      p.lastName AS patientLastName,
      e.firstName AS doctorFirstName,
      e.lastName AS doctorLastName
    FROM appointments a
    JOIN patient p ON a.patientID = p.patientID
    JOIN doctors d ON a.doctorID = d.doctorID
    JOIN employee e ON d.employeeID = e.employeeID
  `;

  console.log("🔥 Final SQL:", sql);

  const params = [];

  if (doctorID) {
    sql += ` WHERE a.doctorID = ?`;
    params.push(doctorID);
  } else {
    sql += ` WHERE a.locationID = ?`;
    params.push(locationID);
  }

  sql += ` ORDER BY a.appointmentDate, a.appointmentTime`;

  console.log("Executing SQL:", sql);
  console.log("With parameters:", params);

  try {
    const connection = await db.getConnection();
    try {
      const [rows] = await connection.query(sql, params);
      console.log("Query returned", rows.length, "appointments");

      if (!rows || !Array.isArray(rows)) {
        console.error("Invalid response from database:", rows);
        throw new Error('Invalid response from database');
      }
      console.log("First row preview:", rows[0]);

      res.json(rows);
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error("Error fetching appointments:", err);
    console.error("Error code:", err.code);
    console.error("Error state:", err.sqlState);
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);
    res.status(500).json({ 
      error: "Failed to fetch appointments", 
      details: err.message,
      code: err.code,
      sqlState: err.sqlState
    });
  }
});

module.exports = router;
