const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get('/doctorschedule/all', async (req, res) => {
  try {
    const query = `
      SELECT 
        s.scheduleID,
        s.dayOfWeek,
        s.startTime,
        s.endTime,
        s.locationID,
        l.name AS locationName,
        d.doctorID,
        e.firstName,
        e.lastName
      FROM doctorschedule s
      JOIN doctors d ON s.doctorID = d.doctorID
      JOIN employee e ON d.employeeID = e.employeeID
      JOIN location l ON s.locationID = l.locationID
      ORDER BY e.lastName, s.dayOfWeek
    `;

    const [results] = await db.query(query);
    res.status(200).json(results);
  } catch (err) {
    console.error("Failed to fetch doctor schedules:", err);
    res.status(500).json({ error: 'Server error fetching schedules' });
  }
});

module.exports = router;
