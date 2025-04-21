const express = require('express');
const router = express.Router();
const db = require('../../db');

router.post('/add', async (req, res) => {
  const { doctorID, locationID, dayOfWeek, startTime, endTime } = req.body;

  if (!doctorID || !locationID || !dayOfWeek || !startTime || !endTime) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [existing] = await db.query(
      `SELECT * FROM doctorschedule WHERE locationID = ? AND dayOfWeek = ?`,
      [locationID, dayOfWeek] );

    if (existing.length > 0) {

      await db.query(
        `UPDATE doctorschedule 
         SET doctorID = ?, startTime = ?, endTime = ? 
         WHERE locationID = ? AND dayOfWeek = ?`,
        [doctorID, startTime, endTime, locationID, dayOfWeek]
      );
      return res.json({ message: 'Schedule updated successfully.' });
    } else {

      await db.query(
        `INSERT INTO doctorschedule (doctorID, locationID, dayOfWeek, startTime, endTime)
         VALUES (?, ?, ?, ?, ?)`,
        [doctorID, locationID, dayOfWeek, startTime, endTime]
      );
      return res.status(201).json({ message: 'Schedule added successfully.' });
    }
  } catch (err) {
    console.error('Schedule insert/update error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}); module.exports = router;

