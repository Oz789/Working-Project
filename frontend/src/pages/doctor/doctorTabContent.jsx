import React, { useState } from "react";
import DoctorAppointments from "./doctorAppointments";
import PatientFormViewer from "../patientPortal/patientFormViewer";
import EmployeeDetails from "../employeePortal/employeeDetails";
import CheckedInAppointments from "../employeePortal/checkedIn";
import DocActiveAppointments from "./doctorActiveAppointments";
import ReceptionistAppointments from "../employeePortal/receptionist/receptionistAppointments";
import ClinicAppointments from "../employeePortal/clinicAppointments";
import { Box, Typography, Tabs, Tab, Paper } from '@mui/material';

// import other tab content 

const DoctorTabContent = ({ activeTab, doctor }) => {

  const toggleMessager = () => {
    setMessager(!messager)
    console.log(messager)

  }
  const [messager, setMessager] = useState(false);
  const [ message, setMessage] = useState("null");
  const msgPasser = (m) => {
    setMessage(m);
  }
  switch (activeTab) {
  
    case 0:
        return (
          <div className="w-full flex flex-row justify-center">
            <DocActiveAppointments />
          </div>
        );
        
          case 1:
            return <EmployeeDetails/>
              
    case 2:
      return ;

    case 3:
      return 
  
    default:
      return null;
  }
};

export default DoctorTabContent;