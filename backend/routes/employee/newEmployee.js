const express = require('express');
const router = express.Router();
const db = require('../../db');
const bcrypt = require('bcrypt');

router.post('/add-employee', async (req, res) => {
  const {
    isAdmin = 0,
    firstName,
    lastName,
    role,
    phone,
    email,
    password,
    gender,
    address,
    locationID,
    licenseNumber
  } = req.body;

  if (!firstName || !lastName || !role || !phone || !email || !password || !locationID) {
    return res.status(400).json({ error: 'All required fields must be provided.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const employeeSQL = `
      INSERT INTO Employee 
      (isAdmin, firstName, lastName, role, phone, email, password, gender, address, locationID)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [employeeResult] = await db.query(employeeSQL, [
      isAdmin,
      firstName,
      lastName,
      role,
      phone,
      email,
      hashedPassword,
      gender,
      address,
      locationID
    ]);

    const employeeID = employeeResult.insertId;

    if (role === "Doctor") {
      const doctorSQL = `INSERT INTO Doctors (employeeID, licenseNumber) VALUES (?, ?)`;
      await db.query(doctorSQL, [employeeID, licenseNumber]);
      return res.status(201).json({ message: "Doctor added successfully", employeeID });
    }

    res.status(201).json({ message: "Employee added successfully", employeeID });
  } catch (err) {
    console.error("❌ Error inserting employee:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

module.exports = router;

