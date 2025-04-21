const express = require('express');
const router = express.Router();
const db = require('../../db'); // your mysql2/promise connection pool

router.post('/createFrame', async (req, res) => {
  const {
    name, price, brand, color, model,
    material, lensWidth, bridgeWidth,
    templeLength, img, stockCount
  } = req.body;

  const frameQuery = `
    INSERT INTO frames (
      name, price, brand, color, model,
      material, lensWidth, bridgeWidth, templeLength, img, stockCount
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const frameValues = [
    name, price, brand, color, model,
    material, lensWidth, bridgeWidth, templeLength, img, stockCount
  ];

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [frameResult] = await connection.query(frameQuery, frameValues);
    const frameID = frameResult.insertId;

    await connection.commit();

    res.status(201).json({
      message: 'Frame created successfully',
      frameID
    });
  } catch (err) {
    if (connection) await connection.rollback();
    console.error('❌ Error creating frame:', err);
    res.status(500).json({ error: 'Failed to create frame' });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;


