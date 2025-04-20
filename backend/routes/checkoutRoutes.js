const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', async (req, res) => {
  console.log("Checkout route hit");

  const { patientID, appointmentNumber, items, total } = req.body;
  console.log("Payload received:", { patientID, appointmentNumber, items, total });

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    console.log("🔐 Transaction started");

    // Insert into Sales table
    const [saleResult] = await connection.query(
      `INSERT INTO Sales (patientID, appointmentNumber, totalAmount, saleDate)
       VALUES (?, ?, ?, NOW())`,
      [patientID, appointmentNumber, total]
    );
    const saleID = saleResult.insertId;
    console.log("Sale inserted with ID:", saleID);

    // Insert sale items and update stock
    for (const item of items) {
      console.log("➡️ Processing item:", item);

      await connection.query(
        `INSERT INTO SaleItems (saleID, itemID, itemType, quantity, price)
         VALUES (?, ?, ?, ?, ?)`,
        [saleID, item.itemID, item.itemType, item.quantity, item.price]
      );
      console.log("Sale item inserted");

      await connection.query(
        `UPDATE Inventory
         SET stockQuantity = stockQuantity - ?
         WHERE itemID = ? AND itemType = ?`,
        [item.quantity, item.itemID, item.itemType]
      );
      console.log("Inventory updated");
    }

    await connection.query(
      `UPDATE Appointments
       SET status = 'Completed'
       WHERE appointmentNumber = ?`,
      [appointmentNumber]
    );
    console.log("Appointment marked as completed");

    await connection.commit();
    connection.release();

    console.log("🎉 Transaction committed successfully");
    res.status(200).json({ message: "Checkout complete and appointment updated." });

  } catch (err) {
    await connection.rollback();
    connection.release();
    console.error("Checkout DB error:", err);
    res.status(500).json({ error: "Checkout failed. Please try again." });
  }
});

module.exports = router;


