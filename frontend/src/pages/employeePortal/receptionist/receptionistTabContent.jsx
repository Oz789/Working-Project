import React, { useState, useEffect } from "react";
import AdminFramesTab from "../../admin/frames/adminFramesTab";
import ManageStaffTab from "../../admin/employee/manageStaffTab";
import AdminContactsTab from "../../admin/contacts/adminContactsTab";
import AdminServicesTab from "../../admin/services/adminServicesTab";
import MsgManager from "../../../components/msgManager";
import AdminReportsPage from "../../admin/reports/adminReportsPage";
import EmployeeDetails from "../employeeDetails";
import ReceptionistAppointments from "./receptionistAppointments";
import ClinicAppointments from "../clinicAppointments";
import CheckedInAppointments from "../checkedIn";
import TestManager from "../../../components/employee/testManager";
import NPatientEdit from "./receptionistPatientEdit";
import PatientDropdown from "../dropDown";
import StockMonitor from "../../admin/reports/stockMonitor"; 

const EmpTabContent = ({ activeTab, setLowStockAlert }) => {
  const [messager, setMessager] = useState(false);
  const [message, setMessage] = useState("null");
  const [hasClicked, setClicked] = useState(false);
  const [stockAlert, setStockAlert] = useState(false); 

  const toggleMessager = () => {
    setMessager(!messager);
    console.log(messager);
  };

  const handleClic = () => {
    setClicked(!hasClicked);
  };

  const falseClic = () => {
    setClicked(false);
  };

  const msgPasser = (m) => {
    setMessage(m);
  };

  useEffect(() => {
    if (activeTab !== 1) {
      setClicked(false);
    }
  }, [activeTab]);

  switch (activeTab) {
    case 0:
      return <EmployeeDetails />;

    case 1:
      return (
        <div>
          {!hasClicked && (
            <div style={{ padding: "2rem" }}>
              <h2
                style={{
                  fontFamily: "Bell MT",
                  color: "#00796B",
                  marginBottom: "1.5rem",
                }}
              >
                Patient Tools
              </h2>

              <button
                style={{
                  backgroundColor: "#00796B",
                  color: "white",
                  padding: "10px 20px",
                  marginRight: "1rem",
                  border: "none",
                  borderRadius: "8px",
                  fontFamily: "Bell MT",
                  fontStyle: "italic",
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
                onClick={() => (window.location.href = "/register")}
              >
                Register Patient
              </button>

              <PatientDropdown bool={handleClic} />
            </div>
          )}

          {hasClicked && <NPatientEdit />}
        </div>
      );

    case 2:
      return <ReceptionistAppointments />;

    case 3:
      return (
        <MsgManager
          bool={toggleMessager}
          pass={msgPasser}
        />
      );

    case 4:
      return <StockMonitor onStockStatusChange={setLowStockAlert} />;

    default:
      return null;
  }
};

export default EmpTabContent;
