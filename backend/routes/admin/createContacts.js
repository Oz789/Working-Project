const express = require('express');
const router = express.Router();
const db = require('../../db');

router.post('/createContact', (req, res) => {
  const {
    name,
    price,
    brand,
    model,
    visionType,
    use,
    daysSupply,
    img,
    stockCount // new field expected from frontend
  } = req.body;

  const insertContactQuery = `
    INSERT INTO eyeContacts (name, price, brand, model, visionType, useType, daysSupply, img)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const contactValues = [
    name,
    price,
    brand,
    model,
    visionType,
    use,
    daysSupply,
    img
  ];

  db.query(insertContactQuery, contactValues, (err, result) => {
    if (err) {
      console.error("Error inserting contact lens:", err);
      return res.status(500).json({ error: "Failed to create contact lens" });
    }

    const contactID = result.insertId;

    const inventoryQuery = `
      INSERT INTO inventory (contactID, stockCount)
      VALUES (?, ?)
    `;

    db.query(inventoryQuery, [contactID, stockCount], (invErr) => {
      if (invErr) {
        console.error("Error inserting into inventory:", invErr);
        return res.status(500).json({ error: "Contact lens created, but failed to add to inventory" });
      }

      res.status(201).json({ message: "Contact and inventory added", contactID });
    });
  });
});

module.exports = router;

