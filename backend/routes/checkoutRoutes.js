const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', async (req, res) => {
  const { patientID, items } = req.body;

  if (!patientID || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Invalid checkout data' });
  }

  try {
    let totalPrice = 0;
    
    // Get frame details (prices) from the inventory table
    const frameDetailsQuery = `
      SELECT frameID, price FROM inventorys WHERE frameID IN (${items.map(item => item.frameID).join(",")})
    `;
    
    const [frameDetails] = await db.promise().query(frameDetailsQuery);
    const framePriceMap = new Map(frameDetails.map(f => [f.frameID, f.price]));

    // Calculate total price and insert items into the itembilling table
    for (const item of items) {
      const { frameID } = item;
      const framePrice = framePriceMap.get(frameID);
      
      if (framePrice) {
        totalPrice += framePrice;

        // Insert into itembilling table
        const insertQuery = `
          INSERT INTO itembilling (patientID, frameID, orderDate, total, paymentStatus)
          VALUES (?, ?, NOW(), ?, 'pending')
        `;
        await db.promise().query(insertQuery, [patientID, frameID, framePrice]);

        // Update stock
        const updateStock = `
          UPDATE inventory SET stockCount = stockCount - 1 WHERE frameID = ? AND stockCount > 0
        `;
        await db.promise().query(updateStock, [frameID]);
      }
    }

    // Now we calculate total owned and update the billing info for the patient (optional step)
    const updatePatientBilling = `
      UPDATE patient SET totalOwned = totalOwned + ? WHERE patientID = ?
    `;
    await db.promise().query(updatePatientBilling, [totalPrice, patientID]);

    res.status(200).json({ message: 'Checkout successful', totalPrice });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Checkout failed' });
  }
});

module.exports = router;
