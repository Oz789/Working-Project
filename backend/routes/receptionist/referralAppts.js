const express = require('express');
const router = express.Router();
const db = require('../../db'); // this is the pool from above

router.post('/', (req, res) => {
  console.log("✅ [Referral POST] Route hit");

  const {
    firstName,
    lastName,
    phoneNumber,
    email,
    referralLocation,
    appointmentDate,
    appointmentTime
  } = req.body;

  console.log("📦 Incoming data:", req.body);

  const sql = `
    INSERT INTO referralappointment
    (firstName, lastName, phoneNumber, email, referralLocation, appointmentDate, appointmentTime, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  const values = [
    firstName,
    lastName,
    phoneNumber,
    email,
    referralLocation,
    appointmentDate,
    appointmentTime
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ [Referral POST] Insert FAILED:", err);
      return res.status(500).json({
        message: 'Error saving referral appointment.',
        error: err.message,
        sqlState: err.sqlState,
        code: err.code
      });
    }

    console.log("✅ [Referral POST] Insert successful:", result);
    res.status(201).json({ message: 'Referral appointment submitted!' });
  });
});

module.exports = router;




