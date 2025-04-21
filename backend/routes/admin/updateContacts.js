const express = require('express');
const router = express.Router();
const db = require('../../db');

router.patch('/contacts/:id', async (req, res) => {
  const contactID = req.params.id;
  const {
    name,
    price,
    brand,
    model,
    visionType,
    use,
    daysSupply,
    img,
    stockCount
  } = req.body;

  const updateQuery = `
    UPDATE eyecontacts SET
      name = ?, price = ?, brand = ?, model = ?, visionType = ?, useType = ?, daysSupply = ?, img = ?, stockCount = ?
    WHERE contactID = ?
  `;

  const values = [
    name, price, brand, model, visionType,
    use, daysSupply, img, stockCount, contactID
  ];

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [result] = await connection.query(updateQuery, values);

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Contact not found or not updated' });
    }

    await connection.commit();
    res.status(200).json({ message: 'Contact updated successfully' });
  } catch (err) {
    if (connection) await connection.rollback();
    console.error('Error updating contact lens:', err);
    res.status(500).json({ error: 'Failed to update contact lens' });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;

