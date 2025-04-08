import React, { useState } from 'react';
import {
  Typography,
  Grid,
  TextField,
  Button,
  IconButton,
  MenuItem
} from '@mui/material';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import './adminFrames.css';

const sizeOptions = {
  Small: {
    lensWidth: '42-48 mm',
    bridgeWidth: '16-17 mm',
    templeLength: '130-135 mm',
  },
  Medium: {
    lensWidth: '49-52 mm',
    bridgeWidth: '18-19 mm',
    templeLength: '136-140 mm',
  },
  Large: {
    lensWidth: '53-58 mm',
    bridgeWidth: '20-22 mm',
    templeLength: '141-150 mm',
  }
};

const AdminFrameModal = ({  onClose, onSubmit }) => {
  const [form, setForm] = useState({
    name: '',
    price: '',
    brand: '',
    color: '',
    model: '',
    material: '',
    lensWidth: '',
    bridgeWidth: '',
    templeLength: '',
    img: '',
    stockCount: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSizeChange = (e) => {
    const selected = e.target.value;
    const values = sizeOptions[selected];
    setForm({
      ...form,
      lensWidth: values.lensWidth,
      bridgeWidth: values.bridgeWidth,
      templeLength: values.templeLength,
    });
  };

  const handleSubmit = () => {
    onSubmit(form);
    if (typeof onClose === "function") onClose();
    
  };

  return (
    <div className="modal">
        <div className="overlay"
    onClick={(e) => { e.stopPropagation();
      if (typeof onClose === "function") onClose();
  }}
></div>
      <div className="modal-content">
        <Grid container spacing={2} direction="column" padding={2}>
          <Typography variant="h4">Create New Frame</Typography>

          <TextField
            name="name"
            label="Name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            name="price"
            label="Price (e.g. $99.99)"
            value={form.price}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            name="img"
            label="Image Path (e.g. /Images/Brescia.webp)"
            value={form.img}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField name="brand" label="Brand" value={form.brand} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField name="model" label="Model" value={form.model} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField name="material" label="Material" value={form.material} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField name="color" label="Color" value={form.color} onChange={handleChange} fullWidth />
            </Grid>
            
          </Grid>

          <Grid container spacing={2} paddingTop={2}>
            <Grid item xs={12}>
              <TextField
                select
                label="Select Size"
                fullWidth
                onChange={handleSizeChange}
              >
                {Object.keys(sizeOptions).map((key) => (
                  <MenuItem key={key} value={key}>{key}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="lensWidth"
                label="Lens Width (mm)"
                value={form.lensWidth}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="bridgeWidth"
                label="Bridge Width (mm)"
                value={form.bridgeWidth}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="templeLength"
                label="Temple Length (mm)"
                value={form.templeLength}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
        <TextField
           name="stockCount"
          label="Stock Count"
          value={form.stockCount}
        onChange={handleChange}
        fullWidth
    />
</Grid>
          </Grid>

          <Button variant="contained" sx={{ marginTop: 3 }} onClick={handleSubmit}>
            Create Frame
          </Button>
        </Grid>

        <IconButton className="shifter" onClick={onClose}>
          <CancelPresentationIcon sx={{ fontSize: 50 }} />
        </IconButton>
      </div>
    </div>
  );
};

export default AdminFrameModal;



