const express = require("express");
const router = express.Router();
const db = require("../../db");

// 🔁 PATCH patientform update (unchanged)
router.patch("/update-form/:id", async (req, res) => {
  const formID = req.params.id;
  const data = req.body;

  const updateSQL = `
    UPDATE patientform SET
      usesCorrectiveLenses = ?,
      usesContacts = ?,
      LensesPrescription = ?,
      ContactsPrescription = ?,
      lastPrescriptionDate = ?,
      healthConcerns = ?,
      otherConcerns = ?,
      conditions = ?,
      otherConditions = ?,
      hadSurgery = ?,
      surgeries = ?,
      otherSurgeries = ?,
      allergies = ?,
      additionalDetails = ?
    WHERE medicalFormID = ?
  `;

  const values = [
    data.usesCorrectiveLenses,
    data.usesContacts,
    data.LensesPrescription,
    data.ContactsPrescription,
    data.lastPrescriptionDate,
    data.healthConcerns,
    data.otherConcerns,
    data.conditions,
    data.otherConditions,
    data.hadSurgery,
    data.surgeries,
    data.otherSurgeries,
    data.allergies,
    data.additionalDetails,
    formID
  ];

  try {
    const [result] = await db.query(updateSQL, values);
    res.status(200).json({ message: "Form updated successfully", affectedRows: result.affectedRows });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Failed to update medical form" });
  }
});


// ✅ GET nurseForm by patientID
router.get("/nurseprep/:patientID", async (req, res) => {
  const { patientID } = req.params;

  try {
    const [rows] = await db.query(
      'SELECT * FROM nurseForm WHERE patientID = ?',
      [patientID]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No nurse form found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('❌ Error fetching nurse form:', err);
    res.status(500).json({ error: 'Failed to fetch nurse form' });
  }
});


// ✅ PATCH nurseForm (insert or update) by patientID
router.patch("/nurseprep/:patientID", async (req, res) => {
  const { patientID } = req.params;
  const {
    employeeID,
    suddenVisionChanges,
    difficultyFocusing,
    eyePainDiscomfort,
    needsGlasses,
    contactLensWearer,
    newOrExisting,
    newConcerns,
    lightSensitivity,
    recentEyeInjury,
    nurseNotes
  } = req.body;

  try {
    const [existing] = await db.query(
      'SELECT * FROM nurseForm WHERE patientID = ?',
      [patientID]
    );

    if (existing.length > 0) {
      // UPDATE
      await db.query(
        `UPDATE nurseForm SET
          employeeID = ?, 
          suddenVisionChanges = ?, 
          difficultyFocusing = ?, 
          eyePainDiscomfort = ?, 
          needsGlasses = ?, 
          contactLensWearer = ?, 
          newOrExisting = ?, 
          newConcerns = ?, 
          lightSensitivity = ?, 
          recentEyeInjury = ?, 
          nurseNotes = ?
        WHERE patientID = ?`,
        [
          employeeID,
          suddenVisionChanges,
          difficultyFocusing,
          eyePainDiscomfort,
          needsGlasses,
          contactLensWearer,
          newOrExisting,
          newConcerns,
          lightSensitivity,
          recentEyeInjury,
          nurseNotes,
          patientID
        ]
      );
    } else {
      // INSERT
      await db.query(
        `INSERT INTO nurseForm (
          patientID, employeeID, suddenVisionChanges, difficultyFocusing,
          eyePainDiscomfort, needsGlasses, contactLensWearer, newOrExisting,
          newConcerns, lightSensitivity, recentEyeInjury, nurseNotes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          patientID,
          employeeID,
          suddenVisionChanges,
          difficultyFocusing,
          eyePainDiscomfort,
          needsGlasses,
          contactLensWearer,
          newOrExisting,
          newConcerns,
          lightSensitivity,
          recentEyeInjury,
          nurseNotes
        ]
      );
    }

    res.json({ message: 'Nurse form saved successfully.' });
  } catch (err) {
    console.error('❌ Error saving nurse form:', err);
    res.status(500).json({ error: 'Failed to save nurse form' });
  }
});

module.exports = router;


