import React, { useState, useEffect } from 'react';
import './nursePrepform.css';
import { useNavigate, useParams } from 'react-router-dom';

const NursePrepForm = ({ nurseID }) => {
  const [editing, setEditing] = useState(true);
  const employeeID = localStorage.getItem("userID");
  const { appointmentNumber } = useParams();
  const navigate = useNavigate();

  const [patientID, setPatientID] = useState(null);
  const [form, setForm] = useState({
    suddenVisionChanges: false,
    difficultyFocusing: false,
    eyePainDiscomfort: false,
    needsGlasses: '',
    contactLensWearer: '',
    newOrExisting: '',
    visionConcerns: '',
    lightSensitivity: '',
    recentEyeInjury: '',
    nurseNotes: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async () => {
    const payload = {
      ...form,
      needsGlasses: form.needsGlasses === 'yes',
      contactLensWearer: form.contactLensWearer === 'yes',
      lightSensitivity: form.lightSensitivity === 'yes',
      appointmentNumber,
      nurseID
    };

    try {
      const res = await fetch(`http://localhost:5001/api/nurseprep/appointment/${appointmentNumber}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('Prep form saved.');
        setEditing(false);
      } else {
        alert('Failed to save prep form.');
      }
    } catch (err) {
      console.error(err);
      alert('Server error.');
    }
  };

  useEffect(() => {
    const fetchPatientID = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/get-patient-from-appointment/${appointmentNumber}`);
        if (res.ok) {
          const data = await res.json();
          setPatientID(data.patientID);
        } else {
          console.warn("Could not find patient for appointment:", appointmentNumber);
        }
      } catch (err) {
        console.error("Error fetching patient ID from appointment:", err);
      }
    };

    const fetchForm = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/nurseprep/appointment/${appointmentNumber}`);
        if (res.ok) {
          const data = await res.json();
          setForm({
            ...data,
            needsGlasses: data.needsGlasses ? 'yes' : 'no',
            contactLensWearer: data.contactLensWearer ? 'yes' : 'no',
            lightSensitivity: data.lightSensitivity ? 'yes' : 'no'
          });
          setEditing(false);
        } else if (res.status === 404) {
          console.log("No existing nurse form. Starting fresh.");
          setEditing(true);
        } else {
          console.warn("Unexpected fetch error");
        }
      } catch (err) {
        console.error("Failed to fetch nurse form:", err);
      }
    };

    fetchPatientID();
    fetchForm();
  }, [appointmentNumber]);

  return (
    <div className="nurse-prep-container">
     <button
  className="back-button"
  onClick={() => {
    const role = localStorage.getItem("userRole");
    const userID = localStorage.getItem("userID");
    const doctorID = localStorage.getItem("doctorID");

    if (role === "nurse") {
      navigate(`/nurseProfile/${userID}`);
    } else if (role === "doctor") {
      navigate(`/doctorProfile/${doctorID}`);
    } else {
      navigate("/"); // fallback
    }
  }}
>
  ← Back to Appointments
</button>


     
      <h2>Nurse Prep Form</h2>

      <label>New or existing patient</label>
      <div className="radio-group">
        <label><input type="radio" name="newOrExisting" value="New" onChange={handleChange} checked={form.newOrExisting === 'New'} disabled={!editing} /> New</label>
        <label><input type="radio" name="newOrExisting" value="Existing" onChange={handleChange} checked={form.newOrExisting === 'Existing'} disabled={!editing} /> Existing</label>
      </div>

      <h3>Symptoms</h3>
      <label><input type="checkbox" name="suddenVisionChanges" checked={form.suddenVisionChanges} onChange={handleChange} disabled={!editing} /> Sudden vision changes</label>
      <label><input type="checkbox" name="difficultyFocusing" checked={form.difficultyFocusing} onChange={handleChange} disabled={!editing} /> Difficulty focusing</label>
      <label><input type="checkbox" name="eyePainDiscomfort" checked={form.eyePainDiscomfort} onChange={handleChange} disabled={!editing} /> Eye pain or discomfort</label>

      <label>Do you need new eye glasses?</label>
      <div className="radio-group">
        <label><input type="radio" name="needsGlasses" value="yes" onChange={handleChange} checked={form.needsGlasses === 'yes'} disabled={!editing} /> Yes</label>
        <label><input type="radio" name="needsGlasses" value="no" onChange={handleChange} checked={form.needsGlasses === 'no'} disabled={!editing} /> No</label>
      </div>

      <label>Are you a contact lens wearer?</label>
      <div className="radio-group">
        <label><input type="radio" name="contactLensWearer" value="yes" onChange={handleChange} checked={form.contactLensWearer === 'yes'} disabled={!editing} /> Yes</label>
        <label><input type="radio" name="contactLensWearer" value="no" onChange={handleChange} checked={form.contactLensWearer === 'no'} disabled={!editing} /> No</label>
      </div>

      <label>Vision concerns today</label>
      <textarea name="visionConcerns" value={form.visionConcerns} onChange={handleChange} disabled={!editing} />

      <label>Are your eyes sensitive to light?</label>
      <div className="radio-group">
        <label><input type="radio" name="lightSensitivity" value="yes" onChange={handleChange} checked={form.lightSensitivity === 'yes'} disabled={!editing} /> Yes</label>
        <label><input type="radio" name="lightSensitivity" value="no" onChange={handleChange} checked={form.lightSensitivity === 'no'} disabled={!editing} /> No</label>
      </div>

      <label>Recent eye injury (describe or type 'None')</label>
      <textarea name="recentEyeInjury" value={form.recentEyeInjury} onChange={handleChange} disabled={!editing} />

      <label>Nurse notes</label>
      <textarea name="nurseNotes" value={form.nurseNotes} onChange={handleChange} rows={3} disabled={!editing} />

      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {editing ? (
          <button className="exam-button secondary-button" onClick={handleSave}>Save</button>
        ) : (
          <button className="exam-button" onClick={() => setEditing(true)}>Re-edit</button>
        )}
      </div>
    </div>
  );
};

export default NursePrepForm;



