import React, { useState, useEffect } from 'react';
import '../../doctor/doctorAppointments.css';
import PatientFormViewer from '../../patientPortal/patientFormViewer';
import ReceptionistCheckout from '../../checkout/receptionistCheckout';
import useBillingSessionStore from '../../billing/appointmentBilling';
import useCartStore from '../../../components/cartStorage';
import { useNavigate } from 'react-router-dom';
import './receptionistCards.css';
import ReferralBookingForm from './receptionistReferralForm';
import RecAppEdit from '../../appointments/recEditApp';

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

const ReceptionistAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedPatientID, setSelectedPatientID] = useState(null);
  const [selectedAppointmentID, setSelectedAppointmentID] = useState(null);
  const [selectedPatientName, setPatientName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showTodayOnly, setShowTodayOnly] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedApptForBilling, setSelectedApptForBilling] = useState(null);
  const { setBillingSession } = useBillingSessionStore();
  const { clearCart } = useCartStore();
  const navigate = useNavigate();
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [viewMode, setViewMode] = useState(null);

  const fetchClinicAppointments = async (locationID) => {
    try {
      const res = await fetch(`http://localhost:5001/api/appointments/clinicAppointmentsDebug/${locationID}`);

      const data = await res.json();
        
      return data.map(appt => {
        const dateObj = new Date(appt.appointmentDate);
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getDate()).padStart(2, '0');
        const rawDate = `${yyyy}-${mm}-${dd}`;
        const cleanTime = appt.appointmentTime?.slice(0, 5);
        console.log("📌 Mapped appointment:", {
          id: appt.appointmentNumber,
          patient: `${appt.patientFirstName} ${appt.patientLastName}`,
          isReferred: appt.isReferred,
          converted: appt.isReferred === 1 || appt.isReferred === "1"
        });
        
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
    } catch (err) {
      console.error("Failed to fetch clinic-specific appointments:", err);
      return [];
    }
  };

  const refreshAppointments = () => {
    const locationID = localStorage.getItem("userLocation");
    if (!locationID) {
      console.warn("No location ID found in localStorage.");
      return;
    }

    fetchClinicAppointments(locationID).then(setAppointments);
  };

  useEffect(() => {
    refreshAppointments();
  }, []);

  const handleCheckIn = async (appointmentID) => {
    try {
      const res = await fetch(`http://localhost:5001/api/appointments/checkin/${appointmentID}`, {
        method: "PATCH",
      });

      if (res.ok) {
        setAppointments(prev =>
          prev.map(appt =>
            appt.appointmentID === appointmentID
              ? { ...appt, status: "Checked In", checkInTime: new Date().toISOString() }
              : appt
          )
        );
      } else {
        console.error("Check-in failed");
      }
    } catch (err) {
      console.error("Check-in error:", err);
    }
  };

  const filtered = appointments.filter(appt =>
    appt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appt.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const visibleAppointments = filtered.filter(appt =>
    appt.status !== "Completed" && appt.status !== "Paid"
  );
  const todayStr = new Date().toISOString().slice(0, 10);

  let filteredByStatus = visibleAppointments;
  if (statusFilter !== 'All') {
    filteredByStatus = filteredByStatus.filter(appt => appt.status === statusFilter);
  }

  const filteredByDate = showTodayOnly
    ? filteredByStatus.filter(appt => appt.appointmentDate === todayStr)
    : filteredByStatus;

  const grouped = groupByDate(filteredByDate);

  return (
    <div className="appointment-wrapper">
      <div className="appointment-left">
        <h2 className="appointments-title">Clinic Appointments</h2>

        <input
          type="text"
          placeholder="Search by patient or doctor..."
          className="search-filter"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%", borderRadius: "6px", border: "1px solid #ccc" }}
        />

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <h2 className="appointments-title" style={{ margin: 0 }}>Clinic Appointments</h2>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: showTodayOnly ? "#004c9b" : "#1976d2",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "500"
              }}
              onClick={() => setShowTodayOnly(prev => !prev)}
            >
              {showTodayOnly ? "Show All" : "Show Today Only"}
            </button>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: "0.5rem",
                borderRadius: "6px",
                border: "1px solid #ccc",
                fontWeight: "500",
                minWidth: "150px"
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Checked In">Checked In</option>
              <option value="In Progress">In Progress</option>
              <option value="Ended">Ended</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {Object.entries(grouped).map(([date, appts]) => (
          <div key={date} className="appointments-section">
            <h3 className="appointments-date">{date}</h3>
            {appts.map((appt) => (
              <div className="appt-card" key={appt.appointmentID}>
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
  {appt.status === "Scheduled" && (
    <button
      onClick={() => handleCheckIn(appt.appointmentID)}
      className="appt-btn checkin"
    >
      Check In
    </button>
  )}

  {appt.status !== "Ended" && (
    <>
      <button
        className="appointment-button"
        onClick={() => {
          setSelectedPatientID(appt.patientID);
          setSelectedAppointmentID(appt.appointmentID);
          setPatientName(appt.patientName);
          setViewMode("edit");
        }}
      >
        Reschedule
      </button>

      <button
        className="appointment-button"
        onClick={() => {
          setSelectedPatientID(appt.patientID);
          setSelectedAppointmentID(appt.appointmentID);
          setPatientName(appt.patientName);
          setViewMode("view");
        }}
      >
        View Form
      </button>
    </>
  )}

  {(appt.status === "Completed" || appt.status === "Ended") && (
    <button
      className="appt-btn bill"
      onClick={() => {
        clearCart();
        setBillingSession(appt.appointmentID, appt.patientID);
        navigate("/checkout");
      }}
    >
      Bill Now
    </button>
  )}



  <button
    className="appt-btn refer"
    disabled={!appt.isReferred}
    style={{
      backgroundColor: appt.isReferred ? "#00796B" : "#ccc",
      color: appt.isReferred ? "white" : "#666",
      marginLeft: "0.5rem",
    }}
    onClick={() => {
      if (appt.isReferred) {
        navigate(`/referral-booking`);
      }
    }}
  >
    Book Referral
  </button>
</div>

              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="appointment-right">
        {selectedPatientID ? (
          viewMode === "edit" ? (
            <RecAppEdit
              patientId={selectedPatientID}
              appointmentID={selectedAppointmentID}
              onAppointmentChange={refreshAppointments}
              patientName={selectedPatientName}
              onClose={() => {
                setSelectedAppointmentID(null);
                setViewMode(null);
              }}
            />
          ) : (
            <PatientFormViewer
              patientID={selectedPatientID}
              onClick={console.log(selectedPatientID)}
              onClose={() => {
                setSelectedAppointmentID(null);
                setViewMode(null);
              }}
            />
          )
        ) : (
          <div className="mock-placeholder">Select an appointment to view the form</div>
        )}
      </div>

      {selectedApptForBilling && (
        <ReceptionistCheckout
          appointmentNumber={selectedApptForBilling.appointmentID}
          patientID={selectedApptForBilling.patientID}
        />
      )}

      {selectedReferral && (
        <ReferralBookingForm
          referralData={selectedReferral}
          onClose={() => setSelectedReferral(null)}
        />
      )}
    </div>
  );
};

export default ReceptionistAppointments;
