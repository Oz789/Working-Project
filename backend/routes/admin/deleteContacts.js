const express = require('express');
const router = express.Router();
const db = require('../../db');

router.delete('/contacts/:id', async (req, res) => {
  const contactID = req.params.id;
  const deleteQuery = 'DELETE FROM eyecontacts WHERE contactID = ?';

  let connection;
  try {
    connection = await db.getConnection();
    const [result] = await connection.query(deleteQuery, [contactID]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.status(200).json({ message: 'Contact lens deleted successfully' });
  } catch (err) {
    console.error('Error deleting contact lens:', err);
    res.status(500).json({ error: 'Failed to delete contact lens' });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;

