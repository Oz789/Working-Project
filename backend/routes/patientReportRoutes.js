const express = require('express');
const router = express.Router();
const db = require('../db');

// Get patient report data
router.get('/', (req, res) => {
  const query = `
    SELECT 
      p.patientID,
      p.firstName,
      p.lastName,
      p.DOB,
      i.insuranceProvider,
      a.paymentStatus,
      pf.usesCorrectiveLenses,
      pf.usesContacts,
      pf.healthConcerns,
      pf.conditions,
      pf.surgeries,
      a.appointmentDate,
      l.Name as locationName,
      l.address as locationAddress,
      CONCAT(e.firstName, ' ', e.lastName) as doctorName
    FROM patient p
    LEFT JOIN patientForm pf ON p.patientID = pf.patientID
    LEFT JOIN insurance i ON pf.insuranceID = i.insuranceID
    LEFT JOIN appointments a ON p.patientID = a.patientID
    LEFT JOIN location l ON a.locationID = l.locationID
    LEFT JOIN doctors d ON a.doctorID = d.doctorID
    LEFT JOIN employee e ON d.employeeID = e.employeeID
    ORDER BY a.appointmentDate DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching patient report:', err);
      return res.status(500).json({ error: 'Failed to fetch patient report' });
    }

    const processedResults = results.map(row => {
      try {
        console.log('Raw healthConcerns:', row.healthConcerns);
        console.log('Raw conditions:', row.conditions);
        console.log('Raw surgeries:', row.surgeries);

        let healthConcerns = [];
        let conditions = [];
        let surgeries = [];

        if (row.healthConcerns) {
          try {
            const parsed = JSON.parse(row.healthConcerns);
            healthConcerns = Array.isArray(parsed) ? parsed : [];
          } catch (e) {
            console.error('Error parsing healthConcerns:', e);
            // If it's not valid JSON, try to split by comma
            healthConcerns = row.healthConcerns.split(',').map(item => item.trim());
          }
        }

        if (row.conditions) {
          try {
            const parsed = JSON.parse(row.conditions);
            conditions = Array.isArray(parsed) ? parsed : [];
          } catch (e) {
            console.error('Error parsing conditions:', e);
            conditions = row.conditions.split(',').map(item => item.trim());
          }
        }

        if (row.surgeries) {
          try {
            const parsed = JSON.parse(row.surgeries);
            surgeries = Array.isArray(parsed) ? parsed : [];
          } catch (e) {
            console.error('Error parsing surgeries:', e);
            surgeries = row.surgeries.split(',').map(item => item.trim());
          }
        }

        console.log('Processed healthConcerns:', healthConcerns);
        console.log('Processed conditions:', conditions);
        console.log('Processed surgeries:', surgeries);

        return {
          ...row,
          healthConcerns: healthConcerns,
          conditions: conditions,
          surgeries: surgeries,
          locationName: row.locationName || 'Not specified',
          locationAddress: row.locationAddress || 'Not specified',
          doctorName: row.doctorName || 'Not specified',
          insuranceProvider: row.insuranceProvider || 'Not specified',
          paymentStatus: row.paymentStatus || 'Not specified'
        };
      } catch (error) {
        console.error('Error processing row:', error);
        return {
          ...row,
          healthConcerns: [],
          conditions: [],
          surgeries: [],
          locationName: row.locationName || 'Not specified',
          locationAddress: row.locationAddress || 'Not specified',
          doctorName: row.doctorName || 'Not specified',
          insuranceProvider: row.insuranceProvider || 'Not specified',
          paymentStatus: row.paymentStatus || 'Not specified'
        };
      }
    });

    res.json(processedResults);
  });
});

module.exports = router; 