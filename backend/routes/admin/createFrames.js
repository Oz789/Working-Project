const express = require('express');
const router = express.Router();
const db = require('../../db');

router.post('/createFrame', (req, res) => {
  const {
    name, price, brand, color, model,
    material, lensWidth, bridgeWidth,
    templeLength, img, stockCount
  } = req.body;

  const frameQuery = `
    INSERT INTO frames (
      name, price, brand, color, model,
      material, lensWidth, bridgeWidth, templeLength, img
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const frameValues = [
    name, price, brand, color, model,
    material, lensWidth, bridgeWidth, templeLength, img
  ];

  db.query(frameQuery, frameValues, (err, result) => {
    if (err) {
      console.error('Error inserting frame:', err);
      return res.status(500).json({ error: 'Failed to create frame' });
    }

    const frameID = result.insertId;

  
    const inventoryQuery = `
      INSERT INTO inventory (frameID, stockCount)
      VALUES (?, ?)
    `;

    const inventoryValues = [
      frameID,
      stockCount,
      parseInt(stockCount, 10)
    ];

    db.query(inventoryQuery, inventoryValues, (invErr) => {
      if (invErr) {
        console.error('Error inserting into inventory:', invErr);
        return res.status(500).json({ error: 'Frame created, but failed to add to inventory' });
      }

      res.status(201).json({
        message: 'Frame and inventory record created successfully',
        frameID
      });
    });
  });
});

module.exports = router;

