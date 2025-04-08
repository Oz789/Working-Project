const express = require('express');
const router = express.Router();
const db = require('../../db');


router.patch('/services/:id', (req, res) => {
  const serviceID = req.params.id;
  const { serviceName, price, description } = req.body;

  const query = `  UPDATE services
    SET serviceName = ?, price = ?, description = ?
    WHERE serviceID = ?`;

  db.query(query, [serviceName, price, description, serviceID], (err, result) => {
    if (err) {
      console.error('Error updating service:', err);
      return res.status(500).json({ error: 'Failed to update service' });
      }  res.status(200).json({ message: 'Service updated successfully' });
  });});

module.exports = router;
