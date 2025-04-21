const express = require("express");
const router = express.Router();
const db = require("../../db");
router.get('/patient-info/:id', async (req, res) => {
    const patientID = req.params.id;
  
    const sql = `
    SELECT 
      p.*, 
      pf.medicalFormID, pf.visitDate, pf.usesCorrectiveLenses, pf.usesContacts,
      pf.LensesPrescription, pf.ContactsPrescription, pf.lastPrescriptionDate,
      pf.healthConcerns, pf.otherConcerns, pf.conditions, pf.otherConditions,
      pf.hadSurgery, pf.surgeries, pf.otherSurgeries, pf.allergies,
      pf.additionalDetails, pf.lastExamDate, pf.insuranceID
    FROM patient p
    LEFT JOIN patientform pf ON p.patientID = pf.patientID
    WHERE p.patientID = ?
  `;
  
    try {
      const [rows] = await db.query(sql, [patientID]);
  
      if (rows.length === 0) {
        return res.status(404).json({ error: "Patient not found" });
      }
  
      const row = rows[0];
  
      const {
        medicalFormID, usesCorrectiveLenses, usesContacts,
        LensesPrescription, ContactsPrescription, lastPrescriptionDate,
        healthConcerns, otherConcerns, conditions, otherConditions,
        hadSurgery, surgeries, otherSurgeries, allergies,
        additionalDetails, lastExamDate, insuranceID,
        visitDate, // optional
        ...patientData
      } = row;
  
      const formatted = {
        ...patientData,
        medicalForm: {
          medicalFormID,
          usesCorrectiveLenses,
          usesContacts,
          LensesPrescription,
          ContactsPrescription,
          lastPrescriptionDate,
          healthConcerns,
          otherConcerns,
          conditions,
          otherConditions,
          hadSurgery,
          surgeries,
          otherSurgeries,
          allergies,
          additionalDetails,
          lastExamDate,
          insuranceID,
          visitDate
        }
      };
  
      res.json(formatted);
    } catch (err) {
      console.error("Error fetching patient info:", err);
      res.status(500).json({ error: "Database error" });
    }
  });
  
  module.exports = router;