const express = require('express');
const router = express.Router();
const db = require('../../db'); 

router.patch('/contacts/:id', (req, res) => {
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
    stockCount // added stockCount
  } = req.body;

  const contactQuery = `
    UPDATE eyecontacts SET
      name = ?, price = ?, brand = ?, model = ?, visionType = ?, useType = ?, daysSupply = ?, img = ?
    WHERE contactID = ?
  `;

  db.query(
    contactQuery,
    [name, price, brand, model, visionType, use, daysSupply, img, contactID],
    (err, result) => {
      if (err) {
        console.error("Error updating contact lens:", err);
        return res.status(500).json({ error: "Failed to update contact lens" });
      }

      const inventoryQuery = `
        UPDATE inventory SET stockCount = ?
        WHERE contactID = ?
      `;

      db.query(inventoryQuery, [stockCount, contactID], (invErr) => {
        if (invErr) {
          console.error("Error updating inventory:", invErr);
          return res.status(500).json({ error: "Contact updated, but failed to update inventory" });
        }

        res.status(200).json({ message: "Contact and inventory updated successfully" });
      });
    }
  );
});

module.exports = router;

