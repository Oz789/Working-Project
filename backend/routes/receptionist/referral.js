const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get('/referrals/:referralID/details', async (req, res) => {
  const { referralID } = req.params;

  const sql = `
    SELECT r.referralID, r.specialistType, r.appointmentNumber, 
           p.firstName AS patientFirst, p.lastName AS patientLast, p.patientID,
           e.firstName AS doctorFirst, e.lastName AS doctorLast, d.doctorID
    FROM Referrals r
    JOIN Appointments a ON a.appointmentNumber = r.appointmentNumber
    JOIN Patient p ON a.patientID = p.patientID
    JOIN Doctors d ON a.doctorID = d.doctorID
    JOIN Employee e ON d.employeeID = e.employeeID
    WHERE r.referralID = ?
  `;

  try {
    const [rows] = await db.promise().query(sql, [referralID]);
    if (rows.length === 0) return res.status(404).json({ message: "Referral not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching referral details:", err);
    res.status(500).json({ message: "Server error", err });
  }
});

router.get('/referrals/by-appointment/:appointmentNumber', async (req, res) => {
    const { appointmentNumber } = req.params;
  
    const sql = `
      SELECT r.referralID, r.specialistType, r.appointmentNumber, 
             p.firstName AS patientFirst, p.lastName AS patientLast, p.patientID,
             e.firstName AS doctorFirst, e.lastName AS doctorLast, d.doctorID
      FROM Referrals r
      JOIN Appointments a ON a.appointmentNumber = r.appointmentNumber
      JOIN Patient p ON a.patientID = p.patientID
      JOIN Doctors d ON a.doctorID = d.doctorID
      JOIN Employee e ON d.employeeID = e.employeeID
      WHERE r.appointmentNumber = ?
    `;
  
    try {
      const [rows] = await db.promise().query(sql, [appointmentNumber]);
      if (rows.length === 0) return res.status(404).json({ message: "No referral found for this appointment" });
      res.json(rows[0]); // or rows if expecting multiple
    } catch (err) {
      console.error("Error fetching referral by appointmentNumber:", err);
      res.status(500).json({ message: "Server error" });
    }
  });
  

// POST new appointment (referral-based)
router.post('/referral-appointments', async (req, res) => {
  const { doctorID, patientID, locationID, appointmentDate, appointmentTime, referralID } = req.body;

  if (!doctorID || !patientID || !appointmentDate || !appointmentTime) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const sql = `
    INSERT INTO Appointments (doctorID, patientID, locationID, appointmentDate, appointmentTime, isReferred, referralID)
    VALUES (?, ?, ?, ?, ?, TRUE, ?)
  `;

  try {
    await db.promise().query(sql, [doctorID, patientID, locationID, appointmentDate, appointmentTime, referralID]);
    res.status(200).json({ message: "Referral appointment created successfully" });
  } catch (err) {
    console.error("Error creating referral appointment:", err);
    res.status(500).json({ message: "Failed to create referral appointment", err });
  }
});

module.exports = router;
