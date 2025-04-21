const express = require('express');
const router = express.Router();
const db = require('../../db');

router.post('/createContact', async (req, res) => {
  const {
    name,
    price,
    brand,
    model,
    visionType,
    use,
    daysSupply,
    stockCount,
    img
  } = req.body;

  const insertQuery = `
    INSERT INTO eyecontacts (
      name, price, brand, model, visionType,
      useType, daysSupply, stockCount, img
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    name,
    price,
    brand,
    model,
    visionType,
    use,
    daysSupply,
    stockCount,
    img
  ];

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [result] = await connection.query(insertQuery, values);

    await connection.commit();
    res.status(201).json({
      message: 'Contact lens created successfully',
      contactID: result.insertId
    });
  } catch (err) {
    if (connection) await connection.rollback();
    console.error('Error creating contact lens:', err);
    res.status(500).json({ error: 'Failed to create contact lens' });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;


