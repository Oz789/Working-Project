const express = require('express');
const router = express.Router();
const db = require('../../db');

// Get list of distinct doctors with schedules
router.get('/', async (req, res) => {
  const sql = `
    SELECT DISTINCT D.doctorID, E.firstName, E.lastName
    FROM doctorschedule S
    JOIN doctors  D ON S.doctorID   = D.doctorID
    JOIN employee E ON D.employeeID = E.employeeID
  `;

  try {
    const [results] = await db.query(sql);

    const columns = results.map(room => ({
      id: room.doctorID,
      name: `${room.firstName} ${room.lastName}`
    }));

    res.json(columns);
  } catch (err) {
    console.error("Error retrieving from database:", err);
    res.status(500).json({ error: "Database error. Please try again later." });
  }
});

// Save new event
router.post('/', async (req, res) => {
  const { sid, did, lid, dow, start, end } = req.body;

  const sql = `
    INSERT INTO doctorschedule (scheduleID, doctorID, locationID, dayOfWeek, startTime, endTime)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  try {
    await db.query(sql, [sid, did, lid, dow, start, end]);
    res.status(200).send("Event saved");
  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).send("Error saving event");
  }
});

// Get all events
router.get('/all', async (req, res) => {
  const sql = `SELECT * FROM doctorschedule`;

  try {
    const [results] = await db.query(sql);
    res.json(results);
  } catch (err) {
    console.error("Error retrieving events:", err);
    res.status(500).send("Error loading events");
  }
});

// Get options for doctors and locations
router.get('/options', async (req, res) => {
  const locationsSql = `SELECT locationID, name FROM location`;
  const doctorsSql = `
    SELECT D.doctorID, E.firstName, E.lastName
    FROM doctors D
    JOIN employee E ON D.employeeID = E.employeeID
  `;

  try {
    const [locations] = await db.query(locationsSql);
    const [doctors] = await db.query(doctorsSql);

    res.json({
      locations: locations.map(loc => ({
        id: loc.locationID,
        name: loc.name
      })),
      doctors: doctors.map(doc => ({
        id: doc.doctorID,
        name: `${doc.firstName} ${doc.lastName}`
      }))
    });
  } catch (err) {
    console.error("Error retrieving options:", err);
    res.status(500).json({ error: "Database error loading options." });
  }
});

module.exports = router;
