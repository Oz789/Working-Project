import React, { useState, useEffect } from 'react';
import '../doctor/doctorAppointments.css';
import './receptionist/receptionistCards.css';
import PatientFormViewer from '../patientPortal/patientFormViewer';
import { useNavigate } from 'react-router-dom';

const CheckedInAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [activeAppointments, setActiveAppointments] = useState([]);
  const [selectedPatientID, setSelectedPatientID] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTodayOnly, setShowTodayOnly] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const locationID = localStorage.getItem("userLocation");
  const doctorID = localStorage.getItem("doctorID");
  const role = localStorage.getItem("userRole");
  const navigate = useNavigate();

  const todayStr = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    const fetchAppointments = async () => {
      let url = role === "doctor" && doctorID
        ? `http://localhost:5001/api/appointments/clinicAppointments/any?doctorID=${doctorID}`
        : locationID
        ? `http://localhost:5001/api/appointments/clinicAppointments/${locationID}`
        : null;

      if (!url) return;

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
            doctorID: appt.doctorID,
            patientID: appt.patientID,
            patientName: `${appt.patientFirstName} ${appt.patientLastName}`.trim(),
            doctorName: `${appt.doctorFirstName} ${appt.doctorLastName}`,
            appointmentDate: rawDate,
            appointmentTime: cleanTime,
            status: appt.status,
          };
        });

        setAppointments(formatted.filter(a => a.status === "Checked In"));
        setActiveAppointments(formatted.filter(a => a.status === "In Progress"));
      } catch (err) {
        console.error("❌ Failed to fetch appointments:", err);
      }
    };

    fetchAppointments();
  }, [locationID, doctorID, role]);

  const handleBeginExam = async (appt) => {
    if (!appt?.appointmentID || !appt?.patientID) return;

    try {
      const res = await fetch(`http://localhost:5001/api/appointments/update-status/${appt.appointmentID}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "In Progress" }),
      });

      if (res.ok) {
        setAppointments(prev => prev.filter(a => a.appointmentID !== appt.appointmentID));
        setActiveAppointments(prev => [...prev, { ...appt, status: "In Progress" }]);
        setTimeout(() => navigate(`/nurseForm/${appt.appointmentID}`), 150);
      } else {
        alert("Failed to begin exam");
      }
    } catch (err) {
      alert("Something went wrong");
    }
  };

  const filterAppointments = (arr) =>
  arr
    .filter(appt =>
      appt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appt.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(appt =>
      statusFilter === 'All' || appt.status === statusFilter
    )
    .filter(appt =>
      !showTodayOnly || appt.appointmentDate === todayStr
    );


  const groupByDate = (arr) => {
    return arr.reduce((acc, appt) => {
      const dt = new Date(`${appt.appointmentDate}T${appt.appointmentTime}`);
      const dateStr = dt.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
      acc[dateStr] = acc[dateStr] || [];
      acc[dateStr].push(appt);
      return acc;
    }, {});
  };

  const grouped = groupByDate([
    ...filterAppointments(appointments),
    ...filterAppointments(activeAppointments),
  ]);

  return (
    <div className="appointment-wrapper">
      <div className="appointment-left">
      <div
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '1rem',
  }}
>
  <h2 className="appointments-title" style={{ margin: 0 }}>
    Clinic Appointments
  </h2>

  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
    <button
      style={{
        padding: '0.5rem 1rem',
        backgroundColor: showTodayOnly ? '#004c9b' : '#1976d2',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '500',
      }}
      onClick={() => setShowTodayOnly(prev => !prev)}
    >
      {showTodayOnly ? 'Show All' : 'Show Today Only'}
    </button>

    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      style={{
        padding: '0.5rem',
        borderRadius: '6px',
        border: '1px solid #ccc',
        fontWeight: '500',
        minWidth: '150px',
      }}
    >
      <option value="All">All Statuses</option>
      <option value="Scheduled">Scheduled</option>
      <option value="Checked In">Checked In</option>
      <option value="In Progress">In Progress</option>
      <option value="Ended">Ended</option>
    </select>
  </div>
</div>


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
            {appts.map((appt) => {
              const cardClass = appt.status === "In Progress"
                ? "appt-card in-progress"
                : "appt-card checked-in";

              return (
                <div
                  className={cardClass}
                  key={appt.appointmentID}
                  onClick={() => appt.status === "In Progress" && navigate(`/nurseForm/${appt.appointmentID}`)}

                  style={{ cursor: appt.status === "In Progress" ? "pointer" : "default" }}
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
                    <button
                      className="appt-btn view"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPatientID(appt.patientID);
                      }}
                    >
                      View Form
                    </button>

                    {appt.status === "Checked In" && (
                      <button
                        className="appt-btn checkin"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBeginExam(appt);
                        }}
                      >
                        Begin Exam
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {selectedPatientID && (
          <div style={{ marginTop: "2rem" }}>
            <h3 className="appointments-title">Patient Form</h3>
            <PatientFormViewer patientID={selectedPatientID} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckedInAppointments;




