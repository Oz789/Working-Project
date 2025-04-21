import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/navBar";

const ReferralBookingForm = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    referralLocation: '',
    appointmentDate: '',
    appointmentTime: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5001/api/referralAppointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert("Referral appointment submitted successfully!");
        setTimeout(() => {
          navigate('/employeeProfile/' + localStorage.getItem('userID'));
        }, 100);
      } else {
        const error = await res.json();
        alert("Failed to submit: " + (error.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Error submitting referral.");
    }
  };

  return (
    <>
    <NavBar/>
    <div style={{ maxWidth: "500px", margin: "2rem auto", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>New Referral Appointment</h2>
      <form onSubmit={handleSubmit}>
        {['firstName', 'lastName', 'phoneNumber',  'referralLocation'].map((field) => (
          <div key={field} style={{ marginBottom: "1rem" }}>
            <label>{field.replace(/([A-Z])/g, ' $1')}:</label>
            <input
              type="text"
              name={field}
              value={form[field]}
              onChange={handleChange}
              required={field !== 'phoneNumber' && field !== 'email'}
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
        ))}

        <div style={{ marginBottom: "1rem" }}>
          <label>Date:</label>
          <input
            type="date"
            name="appointmentDate"
            value={form.appointmentDate}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Time:</label>
          <input
            type="time"
            name="appointmentTime"
            value={form.appointmentTime}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "0.6rem 1rem",
            fontWeight: "bold",
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Submit
        </button>
      </form>
    </div>
    </>
  );
};

export default ReferralBookingForm;


