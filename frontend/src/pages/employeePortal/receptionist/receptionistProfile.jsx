import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReceptionistHeader from "./receptionistHeader";
import ReceptionistTabs from "./receptionistTabs";
import ReceptionistTabContent from "./receptionistTabContent";
import NavBar from "../../../components/receptionistNavBar";

const EmployeeProfilePage = () => {
  const { employeeID } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [employee, setEmployee] = useState(null);
  const [lowStockAlert, setLowStockAlert] = useState(false);

  // Fetch employee
  useEffect(() => {
    fetch(`http://localhost:5001/api/employees/${employeeID}`)
      .then((res) => res.json())
      .then((data) => setEmployee(data))
      .catch((err) => console.error("Error fetching employee:", err));
  }, [employeeID]);

  // Fetch inventory and check for low stock immediately on load
  useEffect(() => {
    const checkLowStock = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/inventory");
        const data = await res.json();
        const lowStock = data.some(
          (item) => (item.type === "frame" || item.type === "contact") && item.stockCount < 5
        );
        setLowStockAlert(lowStock);
      } catch (err) {
        console.error("Error checking low stock:", err);
      }
    };

    checkLowStock();
  }, []);

  if (!employee) return <p>Loading employee profile...</p>;

  const user = {
    name: `${employee.firstName} ${employee.lastName}`,
    role: employee.title || "Receptionist",
    avatar: "/Images/dog-secretary.webp", // replace with dynamic picture
  };

  return (
    <>
      <NavBar />
      <div>
        <ReceptionistHeader name={user.name} role={user.role} avatar={user.avatar} />
        <ReceptionistTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          lowStockAlert={lowStockAlert}
        />
        <ReceptionistTabContent
          activeTab={activeTab}
          employee={employee}
          setLowStockAlert={setLowStockAlert}
        />
      </div>
    </>
  );
};

export default EmployeeProfilePage;

