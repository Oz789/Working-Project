const express = require('express');
const router = express.Router();
const db = require('../../db');

router.post('/', async (req, res) => {
  const {
    appointmentNumber,
    dateOfExam,
    chiefComplaint,
    ocularHistory,
    medicalHistory,
    drugAllergies,
    uvacDistanceRight, uvacDistanceLeft, uvacDistanceBoth, uvacNearBoth,
    bvacDistanceRight, bvacDistanceLeft, bvacDistanceBoth, bvacNearBoth,
    refractionOD, refractionOS,
    iopOD, iopOS,
    lids, cornea, anteriorChamber, iris, lens,
    opticDisc, macula, vessels, retina,
    diagnosis, treatmentPlan,
    referral,  
    patientID
  } = req.body;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    const examSql = `
    INSERT INTO EyeExam (
      appointmentNumber, dateOfExam, chiefComplaint,
      ocularHistory, medicalHistory, drugAllergies,
      uvacDistanceRight, uvacDistanceLeft, uvacDistanceBoth, uvacNearBoth,
      bvacDistanceRight, bvacDistanceLeft, bvacDistanceBoth, bvacNearBoth,
      refractionOD, refractionOS,
      iopOD, iopOS,
      lids, cornea, anteriorChamber, iris, lens,
      opticDisc, macula, vessels, retina,
      diagnosis, treatmentPlan
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      dateOfExam = VALUES(dateOfExam),
      chiefComplaint = VALUES(chiefComplaint),
      ocularHistory = VALUES(ocularHistory),
      medicalHistory = VALUES(medicalHistory),
      drugAllergies = VALUES(drugAllergies),
      uvacDistanceRight = VALUES(uvacDistanceRight),
      uvacDistanceLeft = VALUES(uvacDistanceLeft),
      uvacDistanceBoth = VALUES(uvacDistanceBoth),
      uvacNearBoth = VALUES(uvacNearBoth),
      bvacDistanceRight = VALUES(bvacDistanceRight),
      bvacDistanceLeft = VALUES(bvacDistanceLeft),
      bvacDistanceBoth = VALUES(bvacDistanceBoth),
      bvacNearBoth = VALUES(bvacNearBoth),
      refractionOD = VALUES(refractionOD),
      refractionOS = VALUES(refractionOS),
      iopOD = VALUES(iopOD),
      iopOS = VALUES(iopOS),
      lids = VALUES(lids),
      cornea = VALUES(cornea),
      anteriorChamber = VALUES(anteriorChamber),
      iris = VALUES(iris),
      lens = VALUES(lens),
      opticDisc = VALUES(opticDisc),
      macula = VALUES(macula),
      vessels = VALUES(vessels),
      retina = VALUES(retina),
      diagnosis = VALUES(diagnosis),
      treatmentPlan = VALUES(treatmentPlan)
  `;
  

    const examValues = [
      appointmentNumber, dateOfExam, chiefComplaint,
      ocularHistory, medicalHistory, drugAllergies,
      uvacDistanceRight, uvacDistanceLeft, uvacDistanceBoth, uvacNearBoth,
      bvacDistanceRight, bvacDistanceLeft, bvacDistanceBoth, bvacNearBoth,
      refractionOD, refractionOS,
      iopOD, iopOS,
      lids, cornea, anteriorChamber, iris, lens,
      opticDisc, macula, vessels, retina,
      diagnosis, treatmentPlan
    ];

    await connection.query(examSql, examValues);

   
    if (referral) {
        const referralSql = `
        INSERT INTO Referrals (
          appointmentNumber, patientID, doctorID, referralDate,
          specialistType, referralReason, urgencyLevel,
          referredToClinic, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const referralValues = [
        appointmentNumber,
        patientID,
        referral.doctorID,           
        dateOfExam,
        referral.specialty,
        referral.reason,
        referral.urgency || 'Routine',
        referral.referredTo,
        referral.additionalNotes
      ];

      await connection.query(referralSql, referralValues);
    }

    const {
      updatedLensesPrescription,
      updatedContactsPrescription
    } = req.body;

    const prescriptionSql = `
      INSERT INTO patientform (patientID, visitDate, LensesPrescription, ContactsPrescription)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        LensesPrescription = VALUES(LensesPrescription),
        ContactsPrescription = VALUES(ContactsPrescription),
        visitDate = VALUES(visitDate)
    `;

    await connection.query(prescriptionSql, [
      patientID,
      dateOfExam,
      updatedLensesPrescription,
      updatedContactsPrescription
    ]);

    await connection.commit();
    res.status(201).json({ success: true, message: 'Exam and referral saved' });

  } catch (err) {
    await connection.rollback();
    console.error('Transaction error:', err);
    res.status(500).json({ success: false, message: 'Failed to save exam and referral' });

  } finally {
    connection.release();
  }
});

module.exports = router;

