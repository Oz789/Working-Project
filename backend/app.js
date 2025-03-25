const express = require('express');
const cors = require('cors');
const employeeRoutes = require('./routes/employee/newEmployee'); 
const patientRoutes = require('./routes/patientRoutes');

const app = express();

//if doesnt work, switch the two to have express.json first
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/employees', employeeRoutes); 
app.use('/api/patients', patientRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));