const express = require("express");
const router = express.Router();
const db = require("../../db"); // make sure this points to the BOTTOM db.js

router.patch("/update-status/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  console.log("✅ Route hit with:", id, status); // Add this

  try {
    const [result] = await db.query(
      "UPDATE appointments SET status = ?, checkInTime = NOW() WHERE appointmentNumber = ?",
      [status, id]
    );

    console.log("✅ DB result:", result); // Add this too

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    return res.status(200).json({ message: "Status updated" });
  } catch (err) {
    console.error("❌ DB error in begin exam route:", err);
    return res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;

  