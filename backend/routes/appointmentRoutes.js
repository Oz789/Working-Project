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

  console.log (date + time + patientId + doctorId + service1ID + locationID)

  if (!date || !time || !patientId || !doctorId || !service1ID || !locationID) {
    return res.status(400).json({ error: 'Missing appointmentDate, appointmentTime, patientId, doctorId, or service1ID' });
  }

  try {
    // ✅ Check for conflict for the same doctor
    const [existing] = await db.promise().query(
      'SELECT * FROM appointments WHERE appointmentDate = ? AND appointmentTime = ? AND doctorId = ?',
      [date, time, doctorId]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Time slot already booked for this doctor' });
    }

    // ✅ Insert appointment
    await db.promise().query(
      'INSERT INTO appointments (appointmentDate, appointmentTime, patientId, doctorId, service1ID, locationID) VALUES (?, ?, ?, ?, ?, ?)',
      [date, time, patientId, doctorId, service1ID, locationID]
    );

    res.status(201).json({ message: 'Appointment booked' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Booking failed' });
  }
});

//update given appt
router.put('/', async (req, res) => {
  const { date, time, patientId, doctorId, service1ID, appointmentID, locationID} = req.body;

  

  if (!appointmentID || !date || !time || !patientId || !doctorId || !service1ID || !locationID) {
    return res.status(400).json({ error: 'Missing appointmentDate, appointmentTime, patientId, doctorId, or service1ID' });
  }

  try {
    // ✅ Check for conflict for the same doctor
    const [existing] = await db.promise().query(
      'SELECT * FROM appointments WHERE appointmentDate = ? AND appointmentTime = ? AND doctorId = ? AND appointmentNumber != ?',
      [date, time, doctorId, appointmentID]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Time slot already booked for this doctor' });
    }

    // ✅ Insert appointment
    await db.promise().query(
      `UPDATE appointments SET appointmentDate = ?, appointmentTime = ?, patientId = ?, doctorId = ?, service1ID = ?, locationID = ? 
      WHERE appointmentNumber = ?`,
      [date, time, patientId, doctorId, service1ID, locationID, appointmentID]
    );

    res.status(201).json({ message: 'Appointment updated successfully' });
  } catch (err) {
    console.error("Error updating appointment:",err);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

// Delete appointment by ID
router.delete('/:appointmentID', async (req, res) => {
  const { appointmentID } = req.params;

  if (!appointmentID) {
    return res.status(400).json({ error: 'Missing appointmentID' });
  }

  try {
    const [result] = await db.promise().query(
      'DELETE FROM appointments WHERE appointmentNumber = ?',
      [appointmentID]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (err) {
    console.error("Error cancelling appointment:", err);
    res.status(500).json({ error: 'Failed to cancel appointment' });
  }
});


module.exports = router;
