const express = require('express');
const router = express.Router();
const db = require('../../db');

// Send a message and save it with recipients
router.post('/', async (req, res) => {
  const { senderId, recipients, subject, message } = req.body;

  if (!senderId || !recipients || !Array.isArray(recipients) || recipients.length === 0 || !subject || !message) {
    return res.status(400).json({ error: 'Missing or invalid senderId, recipients, subject, or message.' });
  }

  try {
    // 1. Determine sender info and type
    let userType = 'employee';
    let [senderRows] = await db.query(
      'SELECT firstName, lastName, email, phone FROM employee WHERE employeeID = ?',
      [senderId]
    );

    if (senderRows.length === 0) {
      [senderRows] = await db.query(
        'SELECT firstName, lastName, email, phoneNumber AS phone FROM patient WHERE patientID = ?',
        [senderId]
      );
      userType = 'patient';
    }

    if (senderRows.length === 0) {
      return res.status(404).json({ error: 'Sender not found' });
    }

    const { firstName, lastName, email, phone } = senderRows[0];
    const fullName = `${firstName} ${lastName}`;

    // 2. Insert message into messages table
    const [insertResult] = await db.query(
      `INSERT INTO messages 
       (name, email, phone, message, subject, created_at, sender_id, sender_type)
       VALUES (?, ?, ?, ?, ?, NOW(), ?, ?)`,
      [fullName, email, phone, message, subject, senderId, userType]
    );

    const messageId = insertResult.insertId;

    // 3. Insert each recipient
    for (const recipientEmail of recipients) {
      let [recipientRows] = await db.query(
        'SELECT employeeID AS id FROM employee WHERE email = ?',
        [recipientEmail]
      );
      let recipientType = 'employee';

      if (recipientRows.length === 0) {
        [recipientRows] = await db.query(
          'SELECT patientID AS id FROM patient WHERE email = ?',
          [recipientEmail]
        );
        recipientType = 'patient';
      }

      if (recipientRows.length > 0) {
        await db.query(
          `INSERT INTO messagerecipients 
           (message_id, recipient_id, recipient_type, is_read) 
           VALUES (?, ?, ?, ?)`,
          [messageId, recipientRows[0].id, recipientType, false]
        );
      }
    }

    res.status(200).json({ message: 'Message sent and saved!' });
  } catch (err) {
    console.error(" Error sending message:", err);
    res.status(500).json({
      error: 'Server error',
      details: err.message,
      stack: err.stack
    });
  }
});

module.exports = router;
