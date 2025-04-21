const express = require('express');
const router = express.Router();
const db = require('../../db'); // uses mysql2/promise

router.patch('/patients/:id', async (req, res) => {
  const patientID = req.params.id;
  const {
    firstName,
    lastName,
    DOB,
    sex,
    occupation,
    address,
    phoneNumber,
    email
  } = req.body;

  const updateQuery = `
    UPDATE patient SET
      firstName = ?, lastName = ?, DOB = ?, sex = ?, occupation = ?,
      address = ?, phoneNumber = ?, email = ?
    WHERE patientID = ?
  `;

  const values = [
    firstName,
    lastName,
    DOB,
    sex,
    occupation,
    address,
    phoneNumber,
    email,
    patientID
  ];

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [result] = await connection.query(updateQuery, values);

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Patient not found or not updated' });
    }

    await connection.commit();
    res.status(200).json({ message: 'Patient updated successfully' });

  } catch (err) {
    if (connection) await connection.rollback();
    console.error("Error updating patient:", err);
    res.status(500).json({ error: 'Failed to update patient' });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;
