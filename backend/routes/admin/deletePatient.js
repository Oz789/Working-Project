const express = require('express');
const router = express.Router();
const db = require('../../db');

router.delete('/patients/:id', async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();
    const [result] = await connection.query('UPDATE patient SET isArchived = 1 WHERE patientID = ?', [id]);

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Patient not found' });
    }
    await connection.commit();
    res.status(200).json({ message: 'Patient deleted successfully' });
  } catch (err) {
    if (connection) await connection.rollback();
    console.error('Error deleting patient:', err);
    res.status(500).json({ error: 'Failed to delete patient' });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;

