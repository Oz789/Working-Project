// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();


// const app = express();
// const PORT = process.env.PORT || 3001;




// app.use(express.json()); 
// app.use(cors()); 


// app.get("/", (req, res) => {
//   res.send("API is running...");
// });


// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

const express = require('express');
const cors = require('cors');
const employeeRoutes = require('./routes/employee/newEmployee'); 
const messageRoutes = require('./routes/message/getMessage');
const formRoutes = require('./routes/patients/createContacts')

const test = require('./routes/test');

const app = express();

app.use(express.json()); 
app.use(cors()); 

app.use('/api/employees', employeeRoutes); 

app.use('/api/messages', messageRoutes)

app.use('/api/test', test); 
app.use('/api/submit-form', formRoutes);


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
