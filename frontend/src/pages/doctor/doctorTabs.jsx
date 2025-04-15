import React from "react";
import { Tabs, Tab, Box } from "@mui/material";
//import PatientDataForm from "./patientsDataForm";

<<<<<<< HEAD
const tabLabels = ["Profile", "ActiveAppointments", "Patients", "Inbox"]
=======
const tabLabels = ["Profile", "Appointments", "Active Appointments", "Inbox", "checking"]
>>>>>>> 1fe69826370f9e8bc3dc04d25b71f7706dc34901

const DoctorTabs = ({ activeTab, setActiveTab }) => {
  const handleChange = (e, newVal) => setActiveTab(newVal);



  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Tabs value={activeTab} onChange={handleChange}>
        {tabLabels.map((label, idx) => (
          <Tab key={idx} label={label} />
        ))}
      </Tabs>
    </Box>
  );
};

export default DoctorTabs;