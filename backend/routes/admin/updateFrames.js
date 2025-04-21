const express = require('express');
const router = express.Router();
const db = require('../../db');

router.patch('/frames/:id', async (req, res) => {
  const frameID = req.params.id;
  const {
    name, price, brand, model, material,
    lensWidth, bridgeWidth, templeLength,
    img, stockCount
  } = req.body;

  const updateFrameQuery = `
    UPDATE frames SET
      name = ?, price = ?, brand = ?, model = ?, material = ?,
      lensWidth = ?, bridgeWidth = ?, templeLength = ?, img = ?, stockCount = ?
    WHERE frameID = ?
  `;

  const frameValues = [
    name, price, brand, model, material,
    lensWidth, bridgeWidth, templeLength, img, stockCount, frameID
  ];

  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [updateResult] = await connection.query(updateFrameQuery, frameValues);

    if (updateResult.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Frame not found or nothing updated' });
    }

    await connection.commit();
    res.status(200).json({ message: 'Frame updated successfully' });

  } catch (err) {
    if (connection) await connection.rollback();
    console.error('Error updating frame:', err);
    res.status(500).json({ error: 'Failed to update frame' });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;
