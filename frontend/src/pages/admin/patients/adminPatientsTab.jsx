import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminEditPatientModal from './editPatients';


const ManagePatients = () => {
  const [patients, setPatients] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5001/api/adminPatients')

      .then((res) => setPatients(res.data))
      .catch((err) => console.error("Failed to fetch patients:", err));
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to archive this patient?");
    if (!confirmed) return;
  
    try {
        await axios.delete(`http://localhost:5001/api/patients/${id}`);

      setPatients((prev) => prev.filter(p => p.patientID !== id));
    } catch (err) {
      console.error("Failed to archive patient:", err);
    }
  };
  

  return (
    <div className="staff-tab-container">
      <h2>Manage Patients</h2>

      <table className="styled-table">
        <thead>
          <tr>
           
            <th>First Name</th>
            <th>Last Name</th>
     
            <th>Sex</th>
            <th>Occupation</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Manage</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(p => (
            <tr key={p.patientID}>
            
              <td>{p.firstName}</td>
              <td>{p.lastName}</td>
         
              <td>{p.sex}</td>
              <td>{p.occupation}</td>
              <td>{p.address}</td>
              <td>{p.phoneNumber}</td>
              <td>{p.email}</td>
              <td className="actions-cell">
                <button onClick={() => {
                  setSelectedPatient(p);
                  setEditModalOpen(true);
                }}>Edit</button>
                <button onClick={() => handleDelete(p.patientID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editModalOpen && selectedPatient && (
  <AdminEditPatientModal
    data={selectedPatient}
    onClose={() => setEditModalOpen(false)}
    onSave={async () => {
      const res = await axios.get('http://localhost:5001/api/patients');
      setPatients(res.data);
      setEditModalOpen(false);
    }}
  />
)}

    </div>
  );
};

export default ManagePatients;
