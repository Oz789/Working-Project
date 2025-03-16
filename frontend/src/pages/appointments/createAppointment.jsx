//import "./createAppointment.css";
import React, { useState } from "react";

const BookAppointment = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [appointments, setAppointments] = useState([]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !date || !time) {
      alert("Please fill in all fields.");
      return;
    }
    const newAppointment = { id: Date.now(), name, date, time };
    setAppointments([...appointments, newAppointment]);
    setName("");
    setDate("");
    setTime("");
  };
  
  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Book an Appointment</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        
        <label>Date:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        
        <label>Time:</label>
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        
        <button type="submit" style={{ marginTop: "10px", padding: "10px", cursor: "pointer" }}>Book</button>
      </form>
      
      <h3>Upcoming Appointments</h3>
      <ul>
        {appointments.map((appt) => (
          <li key={appt.id}>{appt.name} - {appt.date} at {appt.time}</li>
        ))}
      </ul>
    </div>
  );
};

export default BookAppointment;
