import React, { useEffect, useState } from "react";
import axios from "axios";
import "./employeeDetails.css";

const EmployeeDetails = () => {
  const [employee, setEmployee] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const userID = localStorage.getItem("userID");

    const fetchEmployee = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/employees`);
        const userData = res.data.find(emp => emp.employeeID == userID);
        setEmployee(userData);
        setFormData(userData);
      } catch (err) {
        console.error("Error fetching employee:", err);
      }
    };

    fetchEmployee();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5001/api/employees/${employee.employeeID}`, formData);
      setEmployee({ ...formData });  
      setEditMode(false);            
    } catch (err) {
      console.error("Error updating employee:", err);
    }
  };
  

  if (!employee) return <p>Loading...</p>;

  return (
    <div className="employee-container">
      <h2 className="employee-header">Employee Details</h2>

      <div className="employee-grid">
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName || ""}
            onChange={handleChange}
            disabled={!editMode}
          />
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName || ""}
            onChange={handleChange}
            disabled={!editMode}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" value={formData.email || ""} disabled />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            disabled={!editMode}
          />
        </div>

        <div className="form-group">
          <label>Role</label>
          <input type="text" value={formData.role || ""} disabled />
        </div>

        <div className="form-group">
          <label>Gender</label>
          <input
            type="text"
            name="gender"
            value={formData.gender || ""}
            onChange={handleChange}
            disabled={!editMode}
          />
        </div>

      </div>

      <div className="button-row">
        {editMode ? (
          <>
            <button className="save-button" onClick={handleSave}>Save</button>
            <button className="cancel-button" onClick={() => {
              setFormData(employee);
              setEditMode(false);
            }}>Cancel</button>
          </>
        ) : (
          <button className="edit-button" onClick={() => setEditMode(true)}>Edit</button>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetails;
