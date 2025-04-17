const express = require('express');
const router = express.Router();
const db = require('../../db');
router.get('/:recipientID', (req, res) => {
  const { recipientID } = req.params;
  console.log("Fetching notifications for recipientID:", recipientID); 

  const sql = `
    SELECT * FROM Notifications
    WHERE recipientID = ? AND recipientRole = 'receptionist'
    ORDER BY createdAt DESC
  `;

  db.query(sql, [recipientID], (err, results) => {
    if (err) {
      console.error("Error fetching notifications:", err); 
      return res.status(500).send("Server error");
    }
    res.json(results);
  });
});

module.exports = router;


