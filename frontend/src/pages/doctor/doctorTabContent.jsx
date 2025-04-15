import React, { useState } from "react";
import DoctorAppointments from "./doctorAppointments";
import PatientFormViewer from "../patientPortal/patientFormViewer";
import EmployeeDetails from "../employeePortal/employeeDetails";
import DoctorActiveAppointments from "./doctorActiveAppointments";


// import other tab content 

const DoctorTabContent = ({ activeTab,doctor }) => {

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
        return <EmployeeDetails/>
        
          case 1:
            return (
              <div className="w-full flex flex-row justify-center">
                <DoctorActiveAppointments />
              </div>
            );
    case 2:
      return <PatientFormViewer />

    case 3:
      return;
    case 4:
   return ;
    default:
      return null;
  }
};

export default DoctorTabContent;