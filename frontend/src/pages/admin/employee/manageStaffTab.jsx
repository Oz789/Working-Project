import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminEditEmployeeModal from "./editEmployee";

import './manageStaff.css';

const AdminStaffTab = () => {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);


  useEffect(() => {
    axios.get('http://localhost:5001/api/employees')
      .then((res) => setEmployees(res.data));
  }, []);

  const handleDelete = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this employee?");
    if (!confirmed) return;
  
    axios.delete(`http://localhost:5001/api/employees/${id}`)
      .then(() => {
        setEmployees((prev) => prev.filter(emp => emp.employeeID !== id));
      })
      .catch((err) => {
        console.error("Failed to delete employee:", err);
      });
  };
  

  return (
    <div className="staff-tab-container">
      <div className="staff-header" >
       
        <button
          className="add-employee-btn"
          onClick={() => navigate('/onboard-employee')} 
        >
          Add New Employee
        </button>
      </div>

      <table className="styled-table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>       
            <th>Phone</th>
            <th>Gender</th>
            <th>Address</th> 
            <th>Role</th>
            <th>Manage</th>
          </tr>
        </thead>
        <tbody>
  {employees.map(emp => (
    <tr key={emp.employeeID}>
      <td>{emp.employeeID}</td>
      <td>{emp.firstName}</td>
      <td>{emp.lastName}</td>
      <td>{emp.email}</td>
      <td>{emp.phone}</td>
      <td>{emp.gender || '—'}</td>       
      <td>{emp.address || '—'}</td>      
      <td>{emp.role}</td>
      <td>
        <button onClick={() => {
          setSelectedEmployee(emp);
          setEditModalOpen(true);
        }}>Edit</button>
        <button onClick={() => handleDelete(emp.employeeID)}>Delete</button>
      </td>
    </tr>
  ))}
</tbody>

      </table>
      {editModalOpen && selectedEmployee && (
  <AdminEditEmployeeModal
    data={selectedEmployee}
    onClose={() => setEditModalOpen(false)}
    onSave={async () => {
      const res = await axios.get('http://localhost:5001/api/employees');
      setEmployees(res.data);
      setEditModalOpen(false);
    }}
  />
)}

    </div>
  );
};

export default AdminStaffTab;
