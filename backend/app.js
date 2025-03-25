const express = require('express');
const cors = require('cors');
const db = require("./db"); // Import the database connection
//const createContact = require("./routes/createContact"); // Ensure correct path
const createContacts = require('./routes/patient/createContacts');
const employeeRoutes = require('./routes/employee/newEmployee'); 
const patientRoutes = require('./routes/patientRoutes');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/employees', employeeRoutes);
app.use("/", createContacts);
app.use('/api/patients', patientRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));