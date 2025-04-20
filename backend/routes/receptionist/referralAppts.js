const express = require('express');
const router = express.Router();
const db = require('../../db'); // ✅ using mysql2/promise pool

router.post('/', async (req, res) => {
  console.log("[Referral POST] Route hit");

  const {
    firstName,
    lastName,
    phoneNumber,
    email,
    referralLocation,
    appointmentDate,
    appointmentTime
  } = req.body;

  console.log("Incoming data:", req.body);

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

  try {
    const connection = await db.getConnection();
    const [result] = await connection.query(sql, values);
    connection.release();

    console.log("[Referral POST] Insert successful:", result);
    res.status(201).json({ message: 'Referral appointment submitted!' });
  } catch (err) {
    console.error("❌ [Referral POST] Insert FAILED:", err);
    res.status(500).json({
      message: 'Error saving referral appointment.',
      error: err.message,
      sqlState: err.sqlState,
      code: err.code
    });
  }
});

module.exports = router;





