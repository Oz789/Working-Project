const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get('/inventory', async (req, res) => {
  try {
    const query = `SELECT  i.itemID,i.stockCount,
       
        f.name AS frameName, f.model AS frameModel, f.material AS frameMaterial,
        f.brand AS frameBrand, f.price AS framePrice,

        c.name AS contactName, c.model AS contactModel,
        c.visionType, c.brand AS contactBrand,
        c.price AS contactPrice

      FROM inventory i
      LEFT JOIN frames f ON i.frameID = f.frameID
      LEFT JOIN eyecontacts c ON i.contactID = c.contactID `;

    const [results] = await db.promise().query(query);

    const formattedResults = results.map(item => {
      if (item.frameName) {
        return {
          itemID: item.itemID,
          type: 'Frame',
          name: item.frameName,
          model: item.frameModel,
          brand: item.frameBrand,
          price: parseFloat(item.framePrice),
          stockCount: item.stockCount
        };
      } else if (item.contactName) {
        return {
          itemID: item.itemID,
          type: 'Contact',
          name: item.contactName,
          model: item.contactModel,
          brand: item.contactBrand,
          price: parseFloat(item.contactPrice),
          stockCount: item.stockCount
        };
      } else {
        return {
          itemID: item.itemID,
          type: 'Unknown',
          name: 'Unknown',
          model: '',
          brand: '',
          price: 0,
          stockCount: item.stockCount
        };
      }
    });

    res.json(formattedResults);
  } catch (err) {
    console.error("Failed to fetch inventory:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

