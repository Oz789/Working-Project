import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./patientProfile.css";
import NavBar from "../../components/navBar";

const PatientProfile = () => {
  const { patientID } = useParams();
  const [patientData, setPatientData] = useState({
    generalInfo: {},
    medicalInfo: {},
    appointments: []
  });
  const [showPastAppointments, setShowPastAppointments] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState('');

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const queryParams = new URLSearchParams({
          showPast: showPastAppointments.toString(),
          ...(selectedServiceType && { serviceType: selectedServiceType })
        });
        
        const res = await fetch(`http://localhost:5001/api/patients/${patientID}?${queryParams}`);
        if (!res.ok) throw new Error("Failed to fetch patient");
        const data = await res.json();
        setPatientData(data);
      } catch (err) {
        console.error("Error fetching patient data:", err);
      }
    };

    fetchPatientData();
  }, [patientID, showPastAppointments, selectedServiceType]);

  return (
    <>
      <NavBar />
      <div className="patient-profile-wrapper">
        <div className="profile-sections-container">
          {/* General Information Section */}
          <div className="profile-section">
            <h2 className="section-title">General Information</h2>
            <div className="profile-info">
              <p><strong>Name:</strong> {`${patientData.generalInfo.firstName} ${patientData.generalInfo.lastName}`}</p>
              <p><strong>Email:</strong> {patientData.generalInfo.email}</p>
              <p><strong>DOB:</strong> {patientData.generalInfo.DOB?.slice(0, 10)}</p>
              <p><strong>Sex:</strong> {patientData.generalInfo.sex}</p>
              <p><strong>Address:</strong> {patientData.generalInfo.address}</p>
              <p><strong>Phone:</strong> {patientData.generalInfo.phoneNumber}</p>
              {patientData.medicalInfo.insuranceProvider && (
                <>
                  <p><strong>Insurance Provider:</strong> {patientData.medicalInfo.insuranceProvider}</p>
                  <p><strong>Policy Number:</strong> {patientData.medicalInfo.policyNumber}</p>
                </>
              )}
            </div>
          </div>

          {/* Medical Information Section */}
          <div className="profile-section">
            <h2 className="section-title">Medical Information</h2>
            <div className="profile-info">
              <p><strong>Last Exam Date:</strong> {patientData.medicalInfo.lastExamDate?.slice(0, 10)}</p>
              <p><strong>Uses Corrective Lenses:</strong> {patientData.medicalInfo.usesCorrectiveLenses ? 'Yes' : 'No'}</p>
              <p><strong>Uses Contacts:</strong> {patientData.medicalInfo.usesContacts ? 'Yes' : 'No'}</p>
              <p><strong>Lenses Prescription:</strong> {patientData.medicalInfo.LensesPrescription}</p>
              <p><strong>Contacts Prescription:</strong> {patientData.medicalInfo.ContactsPrescription}</p>
              <p><strong>Last Prescription Date:</strong> {patientData.medicalInfo.lastPrescriptionDate?.slice(0, 10)}</p>
              <p><strong>Health Concerns:</strong> {patientData.medicalInfo.healthConcerns}</p>
              <p><strong>Conditions:</strong> {patientData.medicalInfo.conditions}</p>
              <p><strong>Allergies:</strong> {patientData.medicalInfo.allergies}</p>
            </div>
          </div>

          {/* Appointments Section */}
          <div className="profile-section">
            <h2 className="section-title">Appointments</h2>
            <div className="appointment-filters">
              <button 
                onClick={() => setShowPastAppointments(!showPastAppointments)}
                className="filter-button"
              >
                {showPastAppointments ? 'Show Upcoming' : 'Show All'}
              </button>
              <select 
                value={selectedServiceType}
                onChange={(e) => setSelectedServiceType(e.target.value)}
                className="filter-select"
              >
                <option value="">All Services</option>
                <option value="4">Eye Exam</option>
                <option value="5">Disease and Eye Treatment</option>
                <option value="6">Curing Blindness</option>
              </select>
            </div>
            <div className="appointments-list">
              {patientData.appointments.length > 0 ? (
                patientData.appointments.map((appointment) => (
                  <div key={appointment.appointmentNumber} className="appointment-card">
                    <p><strong>Date:</strong> {appointment.appointmentDate}</p>
                    <p><strong>Time:</strong> {appointment.appointmentTime}</p>
                    <p><strong>Doctor:</strong> {`${appointment.doctorFirstName} ${appointment.doctorLastName}`}</p>
                    <p><strong>Service:</strong> {appointment.serviceName}</p>
                    <p><strong>Location:</strong> {appointment.locationName}</p>
                    <p><strong>Status:</strong> {appointment.status}</p>
                  </div>
                ))
              ) : (
                <p>No appointments found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientProfile;











