const express = require('express');
const router = express.Router();
const db = require('../../db'); 

router.get('/:doctorID', async (req, res) => {
  const doctorID = req.params.doctorID;

  try {
    const [rows] = await db.query(`
      SELECT 
        a.appointmentNumber,
        a.patientID,
        a.doctorID,
        a.status,
        a.appointmentDate,
        a.appointmentTime,
        a.isReferred,  
        p.firstName AS patientFirstName,
        p.lastName AS patientLastName,
        e.firstName AS doctorFirstName,
        e.lastName AS doctorLastName
      FROM appointments a
      JOIN patient p ON a.patientID = p.patientID
      JOIN doctors d ON a.doctorID = d.doctorID
      JOIN employee e ON d.employeeID = e.employeeID
      WHERE a.doctorID = ?
        AND a.status IN ('Checked In', 'In Progress')
      ORDER BY a.appointmentDate, a.appointmentTime
    `, [doctorID]);

    res.json(rows);
  } catch (err) {
    console.error(" Error fetching doctor's active appointments:", err);
    res.status(500).json({ error: 'Failed to retrieve appointments' });
  }
});

module.exports = router;
