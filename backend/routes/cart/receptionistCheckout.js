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

      // 👇 Handle stock count in either 'frames' or 'eyecontacts'
      if (item.itemType === 'frame') {
        await connection.query(
          `UPDATE frames
           SET stockCount = stockCount - ?
           WHERE frameID = ?`,
          [item.quantity, item.itemID]
        );
      } else if (item.itemType === 'contact') {
        await connection.query(
          `UPDATE eyecontacts
           SET stockCount = stockCount - ?
           WHERE contactID = ?`,
          [item.quantity, item.itemID]
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
    console.error("Finalize checkout error:", err);
    res.status(500).json({ error: "Could not finalize checkout." });
  }
});

module.exports = router;
