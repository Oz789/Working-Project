const express = require('express');
const router = express.Router();
const db = require('../../db'); 


router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [employeeRows] = await db.query('SELECT * FROM employee WHERE employeeID = ?', [id]);
    if (employeeRows.length > 0) {
      return res.json({ userType: 'employee' });
    }

    const [patientRows] = await db.query('SELECT * FROM patient WHERE patientID = ?', [id]);
    if (patientRows.length > 0) {
      return res.json({ userType: 'patient' });
    }

    return res.status(404).json({ userType: null });
  } catch (err) {
    console.error('❌ Error checking user type:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
