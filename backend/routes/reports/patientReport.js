const express = require('express');
const router = express.Router();
const db = require('../../db');

// GET patient report data
router.get('/', async (req, res) => {
  try {
    const connection = await db.getConnection();
    try {
      const [rows] = await connection.query(`
        SELECT 
          p.patientID,
          p.firstName,
          p.lastName,
          p.DOB,
          p.sex,
          p.email,
          p.phoneNumber,
          p.address,
          p.occupation,
          pf.usesCorrectiveLenses,
          pf.usesContacts,
          pf.healthConcerns,
          pf.conditions,
          pf.surgeries,
          pf.LensesPrescription,
          pf.ContactsPrescription,
          DATE_FORMAT(a.appointmentDate, '%Y-%m-%d') AS appointmentDate,
          l.Name AS locationName,
          l.address AS locationAddress,
          CONCAT(e.firstName, ' ', e.lastName) AS doctorName,
          i.insuranceProvider,
          i.policyNumber
        FROM patient p
        LEFT JOIN patientform pf ON p.patientID = pf.patientID
        LEFT JOIN appointments a ON p.patientID = a.patientID
        LEFT JOIN location l ON a.locationID = l.locationID
        LEFT JOIN doctors d ON a.doctorID = d.doctorID
        LEFT JOIN employee e ON d.employeeID = e.employeeID
        LEFT JOIN insurance i ON pf.insuranceID = i.insuranceID
        WHERE a.appointmentDate IS NOT NULL AND a.status != 'Cancelled'
        ORDER BY a.appointmentDate DESC
      `);

      const processedRows = rows.map(row => {
        const parseListField = (value) => {
          if (!value) return [];
          try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return value.split(',').map(v => v.trim());
          }
        };

        return {
          ...row,
          healthConcerns: parseListField(row.healthConcerns),
          conditions: parseListField(row.conditions),
          surgeries: parseListField(row.surgeries),
          doctorName: row.doctorName || 'Not specified',
          locationName: row.locationName || 'Not specified',
          insuranceProvider: row.insuranceProvider || 'Not specified',
          LensesPrescription: row.LensesPrescription || 'N/A',
          ContactsPrescription: row.ContactsPrescription || 'N/A'
        };
      });

      res.json(processedRows);
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error("Error fetching patient report:", err);
    res.status(500).json({
      error: 'Failed to fetch patient report',
      details: err.message
    });
  }
});

module.exports = router;