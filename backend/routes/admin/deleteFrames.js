const express = require('express');
const router = express.Router();
const db = require('../../db'); // uses mysql2/promise

router.delete('/frames/:id', async (req, res) => {
  const frameID = req.params.id;
  const deleteQuery = 'DELETE FROM frames WHERE frameID = ?';

  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [result] = await connection.query(deleteQuery, [frameID]);

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Frame not found' });
    }

    await connection.commit();
    res.status(200).json({ message: 'Frame deleted successfully' });

  } catch (err) {
    if (connection) await connection.rollback();
    console.error('Error deleting frame:', err);
    res.status(500).json({ error: 'Failed to delete frame' });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;


