import React, { useEffect, useState } from "react";
import { TextField, Button, Grid, Typography, CircularProgress } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ReferralBookingForm = () => {
  const { referralID } = useParams();
  const navigate = useNavigate();

  const [details, setDetails] = useState(null);
  const [form, setForm] = useState({
    doctorID: "",
    locationID: "",
    appointmentDate: "",
    appointmentTime: "",
  });

  useEffect(() => {
    const fetchReferralInfo = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/referrals/${referralID}/details`);
        const data = res.data;

        setDetails(data);
        setForm({
          doctorID: data.doctorID,
          locationID: 1, // Or make dynamic
          appointmentDate: "",
          appointmentTime: "",
        });
      } catch (err) {
        console.error("Failed to load referral data:", err);
      }
    };

    fetchReferralInfo();
  }, [referralID]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        referralID,
        patientID: details.patientID,
      };

      await axios.post("http://localhost:5001/api/referral-appointments", payload);
      alert("Referral appointment booked!");
      navigate("/receptionist-profile");
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Failed to book appointment.");
    }
  };

  if (!details) {
    return <CircularProgress sx={{ m: 5 }} />;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <Typography variant="h5" gutterBottom>Book Referral Appointment</Typography>

      <Typography gutterBottom><strong>Referred by:</strong> Dr. {details.doctorFirst} {details.doctorLast}</Typography>
      <Typography gutterBottom><strong>Patient:</strong> {details.patientFirst} {details.patientLast}</Typography>
      <Typography gutterBottom><strong>Specialist Type:</strong> {details.specialistType}</Typography>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={6}>
          <TextField
            type="date"
            name="appointmentDate"
            label="Date"
            InputLabelProps={{ shrink: true }}
            value={form.appointmentDate}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            type="time"
            name="appointmentTime"
            label="Time"
            InputLabelProps={{ shrink: true }}
            value={form.appointmentTime}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Confirm Appointment
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default ReferralBookingForm;


  
