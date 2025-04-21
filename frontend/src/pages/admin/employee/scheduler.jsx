import React, { useState, useEffect } from "react";
import {
  TextField,
  MenuItem,
  Button, Typography,
  Grid, Paper,
  Box
} from "@mui/material";
import axios from "axios";
import ScheduleViewer from "./scheduleViewer";

const daysOfWeek = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

const AdminDoctorScheduleForm = () => {
  const [formData, setFormData] = useState({
    doctorID: "",
    locationID: "",
    dayOfWeek: "",
    startTime: "",
    endTime: ""
  });

  const [status, setStatus] = useState("");
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/doctor/doctors");
        const formatted = res.data
          .map((doc) => ({
            ...doc,
            fullName: `${doc.firstName} ${doc.lastName}`
          }))
          .sort((a, b) => a.fullName.localeCompare(b.fullName));
        setDoctors(formatted);
      } catch (err) {
        console.error("Failed to fetch doctors", err);
      }
    };

    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5001/api/doctorschedule/add", formData);
      setStatus(res.data.message || "Schedule updated");
    } catch (err) {
      setStatus("Error: " + (err.response?.data?.error || "Failed to submit."));
    }
  };

  return (
    <>
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 600, margin: "2rem auto" }}>
        <Typography variant="h5" gutterBottom>
          Add / Update Doctor Schedule
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                label="Doctor"
                name="doctorID"
                value={formData.doctorID}
                onChange={handleChange}
                fullWidth
                required
              >
                {doctors.map((doc) => (
                  <MenuItem key={doc.doctorID} value={doc.doctorID}>
                    {doc.firstName} {doc.lastName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                label="Location"
                name="locationID"
                value={formData.locationID}
                onChange={handleChange}
                fullWidth
                required
              >
                <MenuItem value="1">Eye Clinic 1</MenuItem>
                <MenuItem value="2">Eye Clinic 2</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                label="Day of Week"
                name="dayOfWeek"
                value={formData.dayOfWeek}
                onChange={handleChange}
                fullWidth
                required
              >
                {daysOfWeek.map((day) => (
                  <MenuItem key={day} value={day}>
                    {day}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={6}>
              <TextField
                type="time"
                label="Start Time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                type="time"
                label="End Time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" fullWidth>
                Save Schedule
              </Button>
            </Grid>

            {status && (
              <Grid item xs={12}>
                <Typography sx={{ color: status.includes("Error") ? "red" : "green" }}>
                  {status}
                </Typography>
              </Grid>
            )}
          </Grid>
        </form>
      </Paper>
      <ScheduleViewer />
    </>
  );
};

export default AdminDoctorScheduleForm;

