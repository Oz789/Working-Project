const express = require('express');
const router = express.Router();
const db = require('../../db');

router.patch('/frames/:id', (req, res) => {
  const frameID = req.params.id;
  const {
    name, price, brand, model, material, lensWidth, bridgeWidth,
    templeLength, img, stockCount
  } = req.body;

  const updateFrameQuery = `
    UPDATE frames SET name = ?, price = ?, brand = ?, model = ?, material = ?,
      lensWidth = ?, bridgeWidth = ?, templeLength = ?, img = ?
    WHERE frameID = ?
  `;

  const frameValues = [
    name, price, brand, model, material,
    lensWidth, bridgeWidth, templeLength, img, frameID
  ];

  db.query(updateFrameQuery, frameValues, (err) => {
    if (err) {
      console.error('Error updating frame:', err);
      return res.status(500).json({ error: 'Failed to update frame' });
    }

    // Update inventory stockCount
    const updateInventoryQuery = `
      UPDATE inventory SET stockCount = ? WHERE frameID = ?
    `;

    db.query(updateInventoryQuery, [stockCount, frameID], (invErr) => {
      if (invErr) {
        console.error('Error updating inventory:', invErr);
        return res.status(500).json({ error: 'Frame updated, but failed to update inventory' });
      }

      res.status(200).json({ message: 'Frame and inventory updated successfully' });
    });
  });
});

module.exports = router;
