const express = require('express');
const router = express.Router();
const db = require('../../db');

// GET appointment + base service info
// GET appointment + base service info
router.get('/:appointmentNumber', async (req, res) => {
  const { appointmentNumber } = req.params;

  const apptSQL = `
    SELECT a.*, 
           p.firstName AS patientFirstName, p.lastName AS patientLastName,
           p.patientID,
           e.firstName AS doctorFirstName, e.lastName AS doctorLastName
    FROM appointments a
    JOIN patient p ON a.patientID = p.patientID
    JOIN doctors d ON a.doctorID = d.doctorID
    JOIN employee e ON d.employeeID = e.employeeID
    WHERE a.appointmentNumber = ?
  `;

  try {
    const [apptRows] = await db.query(apptSQL, [appointmentNumber]);

    if (apptRows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const appointment = apptRows[0];

    const serviceSQL = `SELECT * FROM services WHERE serviceName = 'Comprehensive Eye Exams' LIMIT 1`;
    const [serviceRows] = await db.query(serviceSQL);

    const baseService = serviceRows.length > 0
      ? {
          serviceID: serviceRows[0].serviceID,
          name: serviceRows[0].serviceName,
          price: serviceRows[0].price
        }
      : null;

    return res.json({
      appointmentNumber: appointment.appointmentNumber,
      patientID: appointment.patientID,
      patientFirstName: appointment.patientFirstName,
      patientLastName: appointment.patientLastName,
      doctorFirstName: appointment.doctorFirstName,
      doctorLastName: appointment.doctorLastName,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      baseService
    });
  } catch (err) {
    console.error("Error fetching appointment + service:", err);
    res.status(500).json({ error: "Failed to fetch appointment details" });
  }
});


// POST checkout for receptionist + appointment
router.post("/", (req, res) => {
  const { patientID, appointmentNumber, items, total } = req.body;

  const saleSQL = `INSERT INTO Sales (patientID, appointmentNumber, totalAmount) VALUES (?, ?, ?)`;
  db.query(saleSQL, [patientID, appointmentNumber, total], (err, saleResult) => {
    if (err) {
      console.error("Error creating sale:", err);
      return res.status(500).json({ message: "Failed to create sale", err });
    }

    const saleID = saleResult.insertId;

    const saleItemSQL = `INSERT INTO SaleItems (saleID, itemID, itemType, quantity, price) VALUES ?`;
    const values = items.map(item => [
      saleID,
      item.itemID,
      item.itemType,
      item.quantity,
      item.price
    ]);

    db.query(saleItemSQL, [values], (err) => {
      if (err) {
        console.error("Error inserting sale items:", err);
        return res.status(500).json({ message: "Failed to add sale items", err });
      }
      const updatePromises = items
        .filter(item => item.itemType !== "service")
        .map(item => {
          return new Promise((resolve, reject) => {
            const updateSQL = `
              UPDATE ${item.itemType === 'frame' ? 'frames' : 'eyecontacts'}
              SET stockCount = stockCount - ?
              WHERE ${item.itemType === 'frame' ? 'frameID' : 'contactID'} = ?
            `;
            db.query(updateSQL, [item.quantity, item.itemID], (err) => {
              if (err) reject(err);
              else resolve();
            });
          });
        });

        Promise.all(updatePromises)
        .then(() => {
          const endAppointmentSQL = `UPDATE Appointments SET status = 'Completed' WHERE appointmentNumber = ?`;
          db.query(endAppointmentSQL, [appointmentNumber], (err) => {
            if (err) {
              console.error("Error ending appointment:", err);
              return res.status(500).json({ message: "Checkout succeeded but failed to end appointment", err });
            }
      
            res.status(200).json({ message: "Checkout successful and appointment ended." });
          });
        })
      
        .catch(err => {
          console.error("Error updating inventory:", err);
          res.status(500).json({ message: "Failed to update inventory", err });
        });
    });
  });
});

module.exports = router;


