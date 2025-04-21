const express = require("express");
const router = express.Router();
const db = require("../../db");

// GET nurse prep form by appointmentNumber
router.get('/appointment/:appointmentNumber', async (req, res) => {
  const { appointmentNumber } = req.params;

  try {
    const [rows] = await db.query(
      'SELECT * FROM nurseForm WHERE appointmentNumber = ?',
      [appointmentNumber]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No form found for this appointment.' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching nurse form:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// PATCH or INSERT nurse prep form
router.patch('/appointment/:appointmentNumber', async (req, res) => {
  const { appointmentNumber } = req.params;
  const {
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
   
  } = req.body;

  const updateSQL = `
    UPDATE nurseForm
    SET
      suddenVisionChanges = ?,
      difficultyFocusing = ?,
      eyePainDiscomfort = ?,
      needsGlasses = ?,
      contactLensWearer = ?,
      newOrExisting = ?,
      newConcerns = ?,
      lightSensitivity = ?,
      recentEyeInjury = ?,
      nurseNotes = ?,
      createdAt = NOW()
    WHERE appointmentNumber = ?
  `;

  try {
    const [result] = await db.query(updateSQL, [
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
      appointmentNumber
    ]);

    if (result.affectedRows === 0) {
      // INSERT if no form exists
      const insertSQL = `
      INSERT INTO nurseForm (
        appointmentNumber,
       
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
        createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,  NOW())
    `;
    
    await db.query(insertSQL, [
      appointmentNumber,
   
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
    ]);
    

      return res.status(201).json({ message: "Nurse form created." });
    }

    res.status(200).json({ message: "Nurse form updated." });
  } catch (err) {
    console.error("Error upserting nurse form:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

module.exports = router;





