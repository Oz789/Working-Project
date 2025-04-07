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
    waterContent,
    img
  } = req.body;

  const query = `UPDATE eyecontacts SET
      name = ?, price = ?, brand = ?, model = ?, visionType = ?, useType = ?, daysSupply = ?, waterContent = ?, img = ?
     WHERE contactID = ?`;

  db.query(
    query,
    [name, price, brand, model, visionType, use, daysSupply, waterContent, img, contactID],
    (err, result) => {
      if (err) {
        console.error("Error updating contact lens:", err);
        return res.status(500).json({ error: "Failed to update contact lens" });
      }

      res.status(200).json({ message: "Contact lens updated successfully" });
    }
  );
});

module.exports = router;
