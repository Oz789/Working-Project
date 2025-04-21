import React, { useState } from 'react';
import {
  Typography,
  Grid,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem
} from '@mui/material';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import axios from 'axios';

const AdminEditEmployeeModal = ({ data, onClose, onSave }) => {
  const [form, setForm] = useState({ ...data });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await axios.patch(`http://localhost:5001/api/employees/${data.employeeID}`, form);
      if (typeof onSave === 'function') await onSave();
    } catch (error) {
      console.error("Failed to update employee:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Employee</DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              name="firstName"
              label="First Name"
              value={form.firstName}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="lastName"
              label="Last Name"
              value={form.lastName}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="email"
              label="Email"
              value={form.email}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="phone"
              label="Phone"
              value={form.phone}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          {/* 🔽 Role Dropdown */}
          <Grid item xs={12}>
            <TextField
              select
              name="role"
              label="Role"
              value={form.role || ''}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="Doctor">Doctor</MenuItem>
              <MenuItem value="Receptionist">Receptionist</MenuItem>
              <MenuItem value="Nurse">Nurse</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
                name="address"
                label="Address"
                value={form.address || ""}
                onChange={handleChange}
                fullWidth
            />
            </Grid>

            <Grid item xs={12}>
            <TextField
                select
                name="gender"
                label="Gender"
                value={form.gender || ""}
                onChange={handleChange}
                fullWidth
            >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
            </TextField>
            </Grid>

        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary" startIcon={<CancelPresentationIcon />}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminEditEmployeeModal;

