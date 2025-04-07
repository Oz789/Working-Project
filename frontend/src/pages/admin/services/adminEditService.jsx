import React, {useState} from "react";
import {
  Grid,
  Typography,
  IconButton,
  Button,
  TextField
} from "@mui/material";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import axios from "axios";
import "../../services/services.css";

const AdminEditService = ({ data, onClose, onDelete }) => {
  const [editMode, setEditMode] = useState(false);
  const [service, setService] = useState({ ...data });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService((prev) => ({ ...prev, [name]: value }));
  };
  const handleEditSubmit = async () => {
    try {
      await axios.patch(`http://localhost:5001/api/services/${service.serviceID}`, service);
      setEditMode(false);
      alert("Service updated successfully!");
    } catch (err) {
      console.error("Failed to update service:", err);
    }
  };
  const {
    serviceID,
    serviceName,
    description,
    price,
    img
  } = data;

  return (
    <div className="modal">
      <div className="overlay"></div>
      <div className="modal-content">
        <Grid container spacing={2} padding={2}>
          <Grid item xs={12} sm={6}>
            <img
              src={service.img || "/images/default.jpg"}
              alt={service.serviceName}
              className="service-image"
              style={{ border: "2px solid black" }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            {editMode ? (
              <>
                <TextField
                  name="serviceName"
                  label="Service Name"
                  value={service.serviceName}
                  onChange={handleChange}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  name="description"
                  label="Description"
                  value={service.description}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  minRows={3}
                  sx={{ mb: 2 }}
                />
                <TextField
                  name="price"
                  label="Price"
                  type="number"
                  value={service.price}
                  onChange={handleChange}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              </>
            ) : (
              <>
                <Typography variant="h4" className="service-title">{service.serviceName}</Typography>
                <Typography variant="body1" className="service-description">{service.description}</Typography>
                <Typography fontWeight="bold" sx={{ marginTop: 1 }}>
                  ${parseFloat(service.price).toFixed(2)}
                </Typography>
              </>
            )}

            <Grid container spacing={2} sx={{ marginTop: 4 }}>
              <Grid item>
                {editMode ? (
                  <Button variant="contained" color="primary" onClick={handleEditSubmit}>
                    Save
                  </Button>
                ) : (
                  <Button variant="outlined" color="primary" onClick={() => setEditMode(true)}>
                    Edit
                  </Button>
                )}
              </Grid>
              <Grid item>
                <Button variant="outlined" color="error" onClick={() => onDelete(service.serviceID)}>
                  Delete
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <IconButton className="shifter" onClick={onClose}>
          <CancelPresentationIcon sx={{ fontSize: 50 }} />
        </IconButton>
      </div>
    </div>
  );
};

export default AdminEditService;
