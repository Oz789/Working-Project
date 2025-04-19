const express = require('express');
const router = express.Router();
const db = require('../../db');

router.post('/', async (req, res) => {
  const { patientID, appointmentNumber, items, total } = req.body;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [saleResult] = await connection.query(
      `INSERT INTO Sales (patientID, appointmentNumber, totalAmount, saleDate)
       VALUES (?, ?, ?, NOW())`,
      [patientID, appointmentNumber, total]
    );

    const saleID = saleResult.insertId;

    for (const item of items) {
      await connection.query(
        `INSERT INTO SaleItems (saleID, itemID, itemType, quantity, price)
         VALUES (?, ?, ?, ?, ?)`,
        [saleID, item.itemID, item.itemType, item.quantity, item.price]
      );

      if (item.itemType !== 'service') {
        await connection.query(
          `UPDATE Inventory
           SET stockQuantity = stockQuantity - ?
           WHERE itemID = ? AND itemType = ?`,
          [item.quantity, item.itemID, item.itemType]
        );
      }
    }

    await connection.query(
      `UPDATE Appointments
       SET status = 'Completed'
       WHERE appointmentNumber = ?`,
      [appointmentNumber]
    );

    await connection.commit();
    connection.release();

    res.status(200).json({ message: "Checkout finalized." });
  } catch (err) {
    await connection.rollback();
    connection.release();
    console.error("❌ Finalize checkout error:", err);
    res.status(500).json({ error: "Could not finalize checkout." });
  }
});

module.exports = router;
