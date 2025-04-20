import React, { useState, useEffect } from 'react';
import '../doctor/doctorAppointments.css';
import { useNavigate } from 'react-router-dom';
import '../employeePortal/receptionist/receptionistCards.css';

const groupByDate = (appointments) => {
  return appointments.reduce((acc, appt) => {
    const dt = new Date(`${appt.appointmentDate}T${appt.appointmentTime}`);
    const dateStr = dt.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    acc[dateStr] = acc[dateStr] || [];
    acc[dateStr].push(appt);
    return acc;
  }, {});
};

const DocActiveAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const doctorID = localStorage.getItem("doctorID");
  const role = localStorage.getItem("userRole");
  const locationID = localStorage.getItem("userLocation");

  useEffect(() => {
    const fetchAppointments = async () => {
      let url = "";

      if (role === "doctor" && doctorID) {
        url = `http://localhost:5001/api/appointments/activeByDoctor/${doctorID}`;
      } else if (locationID) {
        url = `http://localhost:5001/api/appointments/clinicAppointments/${locationID}`;
      } else {
        return;
      }

      try {
        const res = await fetch(url);
        const data = await res.json();

        const formatted = data.map(appt => {
          const dateObj = new Date(appt.appointmentDate);
          const yyyy = dateObj.getFullYear();
          const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
          const dd = String(dateObj.getDate()).padStart(2, '0');
          const rawDate = `${yyyy}-${mm}-${dd}`;
          const cleanTime = appt.appointmentTime?.slice(0, 5);

          return {
            appointmentID: appt.appointmentNumber,
            patientID: appt.patientID,
            doctorID: appt.doctorID,
            patientName: `${appt.patientFirstName} ${appt.patientLastName}`.trim(),
            doctorName: `${appt.doctorFirstName} ${appt.doctorLastName}`,
            appointmentDate: rawDate,
            appointmentTime: cleanTime,
            status: appt.status,
            isReferred: appt.isReferred === 1 || appt.isReferred === "1"
          };
        });

        const visible = formatted.filter(appt =>
          appt.status === "Checked In" || appt.status === "In Progress"
        );

        setAppointments(visible);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
      }
    };

    fetchAppointments();
  }, [doctorID, locationID, role]);

  const filtered = appointments.filter(appt =>
    appt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appt.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const grouped = groupByDate(filtered);

  return (
    <div className="appointment-wrapper">
      <div className="appointment-left">
        <h2 className="appointments-title">Doctor Appointments</h2>
        <input
          type="text"
          placeholder="Search by patient or doctor..."
          className="search-filter"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {Object.entries(grouped).map(([date, appts]) => (
          <div key={date} className="appointments-section">
            <h3 className="appointments-date">{date}</h3>
            {appts.map((appt) => (
              <div
                className="appt-card"
                key={appt.appointmentID}
                onClick={() => {
                  if (appt.status === "In Progress") {
                    navigate(`/doctorexamform/${appt.appointmentID}/${appt.patientID}`);
                  }
                }}
                style={{
                  cursor: appt.status === "In Progress" ? "pointer" : "default"
                }}
              >
                <div className="appt-header">
                  <img
                    className="appt-avatar"
                    src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"
                    alt="Avatar"
                  />
                  <div className="appt-details">
                    <h3 className="appt-name">{appt.patientName}</h3>
                    <div className="appt-meta"><span className="appt-label">Status:</span> {appt.status}</div>
                    <div className="appt-meta"><span className="appt-label">Doctor:</span> {appt.doctorName}</div>
                    <div className="appt-meta"><span className="appt-label">Time:</span> {appt.appointmentTime}</div>
                  </div>
                </div>

                <div className="appt-buttons">
                  {appt.status === "Checked In" && (
                    <button
                      className="appointment-button"
                      onClick={(e) => {
                        e.stopPropagation(); // prevent card click
                        navigate(`/nurseExamPage/${appt.patientID}`);
                      }}
                    >
                      Begin Exam
                    </button>
                  )}
                  <button
  className="appt-btn"
  style={{
    backgroundColor: "#0288d1",
    color: "white",
    marginLeft: "0.5rem"
  }}
  onClick={(e) => {
    e.stopPropagation();
    navigate(`/nurseForm/${appt.appointmentID}`);
  }}
>
  Nurse Form
</button>


                  <button
                    className="appt-btn refer"
                    disabled={!appt.isReferred}
                    style={{
                      backgroundColor: appt.isReferred ? "#00796B" : "#ccc",
                      color: appt.isReferred ? "white" : "#666",
                      marginLeft: "0.5rem"
                    }}
                    onClick={(e) => {
                      e.stopPropagation(); 
                      if (appt.isReferred) {
                        navigate(`/referral-booking`);
                      }
                    }}
                  >
                    Book Referral
                  </button>
                  {appt.status === "In Progress" && (
  <button
    className="appt-btn end"
    onClick={async (e) => {
      e.stopPropagation();
      try {
        const res = await fetch(`http://localhost:5001/api/appointments/end/${appt.appointmentID}`, {
          method: 'PATCH'
        });

        if (res.ok) {
          alert(" Appointment marked as ended.");
          setAppointments(prev =>
            prev.map(a =>
              a.appointmentID === appt.appointmentID
                ? { ...a, status: "Ended" }
                : a
            )
          );
        } else {
          alert("⚠️ Failed to end appointment.");
        }
      } catch (err) {
        console.error("End error:", err);
        alert("Server error while ending appointment.");
      }
    }}
    style={{
      backgroundColor: "#b71c1c",
      color: "white",
      marginLeft: "0.5rem"
    }}
  >
    End Appointment
  </button>
)}


                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Right Panel Removed */}
      <div className="appointment-right">
        <div className="mock-placeholder">Click an in-progress appointment to continue exam</div>
      </div>
    </div>
  );
};

export default DocActiveAppointments;


