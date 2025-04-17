const express = require('express');
const router = express.Router();
const db = require('../../db'); 

router.patch('/:id', (req, res) => {
  const notificationID = req.params.id;

  const sql = `UPDATE Notifications SET isRead = TRUE WHERE notificationID = ?`;

  db.query(sql, [notificationID], (err, result) => {
    if (err) {
      console.error("Failed to mark notification as read:", err);
      return res.status(500).send("Failed to update notification");
    }
    res.send({ success: true, message: 'Notification marked as read' });
  });
});

module.exports = router;
