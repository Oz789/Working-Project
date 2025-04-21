const express = require('express');
const router = express.Router();
const db = require('../../db'); 
router.patch('/employees/:id', async (req, res) => {
  const employeeID = req.params.id;
  const {
    firstName,
    lastName,
    email,
    phone,
    role,
    gender,
    address
  } = req.body;

  const updateQuery = `
    UPDATE employee SET
      firstName = ?, lastName = ?, email = ?, phone = ?,
      role = ?, gender = ?, address = ?
    WHERE employeeID = ?
  `;

  const values = [
    firstName,
    lastName,
    email,
    phone,
    role,
    gender,
    address,
    employeeID
  ];

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [result] = await connection.query(updateQuery, values);

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Employee not found or unchanged' });
    }

    await connection.commit();
    res.status(200).json({ message: 'Employee updated successfully' });

  } catch (err) {
    if (connection) await connection.rollback();
    console.error(" Error updating employee:", err);
    res.status(500).json({ error: 'Failed to update employee' });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;
