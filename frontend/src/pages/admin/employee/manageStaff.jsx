import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './manageStaff.css';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

const AdminStaff = () => {
  const [employees, setEmployees] = useState([]);
  const [roleFilter, setRoleFilter] = useState('');
  const [editingRow, setEditingRow] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    axios.get('http://localhost:5001/api/employees')
      .then((res) => setEmployees(res.data));
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5001/api/employees/${id}`).then(() => {
      setEmployees((prev) => prev.filter(emp => emp.employeeID !== id));
    });
  };

  const handleEditClick = (emp) => {
    setEditingRow(emp.employeeID);
    setEditData({ ...emp });
  };

  const handleChange = (e, field) => {
    setEditData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5001/api/employees/${editingRow}`, editData);
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.employeeID === editingRow ? { ...emp, ...editData } : emp
        )
      );
      setEditingRow(null);
    } catch (err) {
      console.error("❌ Update failed", err);
    }
  };

  const filteredEmployees = roleFilter
    ? employees.filter(emp => emp.role.toLowerCase() === roleFilter.toLowerCase())
    : employees;

  return (
    <div className="staff-container">
      <h2 style={{ fontFamily: 'Serif', fontWeight: 'bold', fontSize: '32px' }}>Manage Staff</h2>

      <div className="filter-row">
        <Grid container spacing={2} marginBottom={3}>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={roleFilter}
                label="Filter by Role"
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Employee">Employee</MenuItem>
                <MenuItem value="Doctor">Doctor</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth disabled>
              <InputLabel>Filter by Location</InputLabel>
              <Select value="">
                <MenuItem value="">All</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField fullWidth label="Search" placeholder="Search staff..." disabled />
          </Grid>
        </Grid>
      </div>

      <table className="styled-table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Manage</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map(emp => (
            <tr key={emp.employeeID}>
              <td>{emp.employeeID}</td>
              <td>
                {editingRow === emp.employeeID ? (
                  <input
                    type="text"
                    value={editData.firstName || ''}
                    onChange={(e) => handleChange(e, "firstName")}
                    style={{ width: "100%" }}
                  />
                ) : emp.firstName}
              </td>
              <td>
                {editingRow === emp.employeeID ? (
                  <input
                    type="text"
                    value={editData.lastName || ''}
                    onChange={(e) => handleChange(e, "lastName")}
                    style={{ width: "100%" }}
                  />
                ) : emp.lastName}
              </td>
              <td>
                {editingRow === emp.employeeID ? (
                  <input
                    type="text"
                    value={editData.email || ''}
                    onChange={(e) => handleChange(e, "email")}
                    style={{ width: "100%" }}
                  />
                ) : emp.email}
              </td>
              <td>
                {editingRow === emp.employeeID ? (
                  <input
                    type="text"
                    value={editData.phone || ''}
                    onChange={(e) => handleChange(e, "phone")}
                    style={{ width: "100%" }}
                  />
                ) : emp.phone}
              </td>
              <td>{emp.role}</td>
              <td>
                {editingRow === emp.employeeID ? (
                  <>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={() => setEditingRow(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEditClick(emp)}>Edit</button>
                    <button onClick={() => handleDelete(emp.employeeID)}>Delete</button>
                    {emp.role === "Doctor" && (
                      <button
                        onClick={() =>
                          window.location.href = `/schedule-doctor/${emp.employeeID}`
                        }
                      >
                        Schedule
                      </button>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminStaff;



