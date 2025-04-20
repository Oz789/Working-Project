const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get('/adminPatients', async (req, res) => {
  try {
    const [patients] = await db.query(`
      SELECT 
        patientID, medicalFormID, firstName, lastName, DOB, sex, occupation, 
        address, phoneNumber, email
      FROM patient
WHERE isArchived = 0

    `);

    res.status(200).json(patients);
  } catch (err) {
    console.error(' Error fetching patients for admin:', err);
    res.status(500).json({ error: 'Failed to fetch patients for admin' });
  }
});

module.exports = router;
