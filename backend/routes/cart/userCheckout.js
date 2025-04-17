const express = require('express');
const router = express.Router();
const db = require('../../db');

router.post("/checkout/user", (req, res) => {
  const { patientID, items, total } = req.body;

  if (!patientID || !items || items.length === 0) {
    return res.status(400).json({ message: "Missing required checkout data" });
  }

  const saleSQL = `INSERT INTO Sales (patientID, totalAmount) VALUES (?, ?)`;
  db.query(saleSQL, [patientID, total], (err, saleResult) => {
    if (err) {
      console.error("Error creating sale:", err);
      return res.status(500).json({ message: "Failed to create sale", err });
    }

    const saleID = saleResult.insertId;
    const saleItemSQL = `INSERT INTO SaleItems (saleID, itemID, itemType, quantity, price) VALUES ?`;
    const values = items.map(item => [saleID, item.itemID, item.itemType, item.quantity, item.price]);

    db.query(saleItemSQL, [values], (err) => {
      if (err) {
        console.error("Error inserting sale items:", err);
        return res.status(500).json({ message: "Failed to add sale items", err });
      }

      // Inventory updates
      const updatePromises = items.map(item => {
        return new Promise((resolve, reject) => {
          let updateSQL = "";
          if (item.itemType === "frame") {
            updateSQL = `UPDATE Frames SET stockCount = stockCount - ? WHERE frameID = ?`;
          } else if (item.itemType === "contact") {
            updateSQL = `UPDATE EyeContacts SET stockCount = stockCount - ? WHERE contactID = ?`;
          } else {
            return reject(new Error("Invalid item type"));
          }

          db.query(updateSQL, [item.quantity, item.itemID], (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      });

      Promise.all(updatePromises)
        .then(() => res.status(200).json({ message: "Checkout successful" }))
        .catch(err => {
          console.error("❌ Error updating stock:", err);
          res.status(500).json({ message: "Stock update failed", err });
        });
    });
  });
});

module.exports = router;

