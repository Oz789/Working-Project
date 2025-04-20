import React, { useEffect, useState } from 'react';
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Grid
} from '@mui/material';
import axios from 'axios';

const ScheduleViewer = () => {
  const [clinic1Schedules, setClinic1Schedules] = useState([]);
  const [clinic2Schedules, setClinic2Schedules] = useState([]);

  const dayOrder = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 7
  };

  const formatTime = (timeStr) => {
    const [hour, minute] = timeStr.split(":");
    const h = parseInt(hour, 10);
    const suffix = h >= 12 ? "PM" : "AM";
    const displayHour = ((h + 11) % 12 + 1);
    return `${displayHour}:${minute} ${suffix}`;
  };

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/doctorschedule/all');
        const all = res.data;

        const sorted1 = all
          .filter(s => s.locationID === 1)
          .sort((a, b) => dayOrder[a.dayOfWeek] - dayOrder[b.dayOfWeek]);

        const sorted2 = all
          .filter(s => s.locationID === 2)
          .sort((a, b) => dayOrder[a.dayOfWeek] - dayOrder[b.dayOfWeek]);

        setClinic1Schedules(sorted1);
        setClinic2Schedules(sorted2);
      } catch (err) {
        console.error('Failed to fetch schedules:', err);
      }
    };

    fetchSchedules();
  }, []);

  const renderScheduleTable = (schedules, title) => (
    <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
      <Typography variant="h6" align="center" sx={{ paddingTop: 2 }}>
        {title}
      </Typography>
      <Table>
        <TableHead sx={{ backgroundColor: '#bbdefb' }}>
          <TableRow>
            <TableCell><strong>Doctor</strong></TableCell>
            <TableCell><strong>Day</strong></TableCell>
            <TableCell><strong>Start Time</strong></TableCell>
            <TableCell><strong>End Time</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {schedules.map((row, i) => (
            <TableRow key={i}>
              <TableCell>{row.firstName} {row.lastName}</TableCell>
              <TableCell>{row.dayOfWeek}</TableCell>
              <TableCell>{formatTime(row.startTime)}</TableCell>
              <TableCell>{formatTime(row.endTime)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Grid container spacing={3} padding={4}>
      <Grid item xs={12}>
        <Typography variant="h4" align="center" gutterBottom>
          Doctor Weekly Schedules
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        {renderScheduleTable(clinic1Schedules, "Eye Clinic 1")}
      </Grid>

      <Grid item xs={12} md={6}>
        {renderScheduleTable(clinic2Schedules, "Eye Clinic 2")}
      </Grid>
    </Grid>
  );
};

export default ScheduleViewer;
