// appointmentRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all booked appointments
router.get('/', async (req, res) => {
  const locationID = req.query.locationID;

  try {
    let sql = 'SELECT appointmentDate, appointmentTime FROM appointments';
    let params = [];

    if (locationID) {
      sql += ' WHERE locationID = ?';
      params.push(locationID);
    }

    const [rows] = await db.promise().query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});


// Book a new appointment
router.post('/', async (req, res) => {
  const { date, time, patientId, doctorId, service1ID, locationID } = req.body;

  console.log("Received request body:", req.body);
  console.log("Extracted locationID:", locationID);

  // Parse all IDs as integers
  const parsedPatientId = parseInt(patientId);
  const parsedDoctorId = parseInt(doctorId);
  const parsedService1ID = parseInt(service1ID);
  const parsedLocationID = parseInt(locationID);

  console.log("Parsed IDs:", {
    patientId: parsedPatientId,
    doctorId: parsedDoctorId,
    service1ID: parsedService1ID,
    locationID: parsedLocationID
  });

  if (!date || !time || !parsedPatientId || !parsedDoctorId || !parsedService1ID || !parsedLocationID) {
    console.log("Missing fields:", {
      date: !date,
      time: !time,
      patientId: !parsedPatientId,
      doctorId: !parsedDoctorId,
      service1ID: !parsedService1ID,
      locationID: !parsedLocationID
    });
    return res.status(400).json({ error: 'Missing appointmentDate, appointmentTime, patientId, doctorId, service1ID, or locationID' });
  }

  try {
    // Check for conflict for the same doctor
    const [existing] = await db.promise().query(
      'SELECT * FROM appointments WHERE appointmentDate = ? AND appointmentTime = ? AND doctorId = ?',
      [date, time, parsedDoctorId]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Time slot already booked for this doctor' });
    }

    // Insert appointment
    const insertQuery = 'INSERT INTO appointments (appointmentDate, appointmentTime, patientId, doctorId, service1ID, locationID) VALUES (?, ?, ?, ?, ?, ?)';
    const insertParams = [date, time, parsedPatientId, parsedDoctorId, parsedService1ID, parsedLocationID];
    
    console.log("Executing SQL query:", insertQuery);
    console.log("With parameters:", insertParams);

    await db.promise().query(insertQuery, insertParams);

    res.status(201).json({ message: 'Appointment booked' });
  } catch (err) {
    console.error("Error in appointment booking:", err);
    res.status(500).json({ error: 'Booking failed' });
  }
});

module.exports = router;
