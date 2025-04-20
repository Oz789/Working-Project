import React, { useEffect, useState } from 'react';
import {
  Typography,
  Grid,
  Button,
  IconButton,
  TextField
} from '@mui/material';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import './adminContactsModal.css'; 
import axios from 'axios';

const AdminEditContacts = ({ data, onClose, onEdit, onDelete }) => {
 
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ ...data });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    try {
      await axios.patch(`http://localhost:5001/api/contacts/${data.contactID}`, form);
      if (typeof onEdit === "function") await onEdit(); 
      if (typeof onClose === "function") onClose();    
    } catch (error) {
      console.error("Update failed:", error);
    }
  };
  

  return (
    <div className="modal">
      <div className="overlay"
    onClick={(e) => { e.stopPropagation();
      if (typeof onClose === "function") onClose();
  }}
></div>
      <div className="modal-content">
        <Grid container spacing={2} padding={2}>
   
          <Grid item xs={12} sm={6}>
            <img src={data.img || "/Images/1_DAY_ACUVUE_MOIST_90_Pack.avif"} alt="Contact Lens" className="item-image" />
          </Grid>
                                       {/* CHANGE IMAGE HERE !!!!! */}
         
          <Grid item xs={12} sm={6}>
            {isEditing ? (
              <>
                <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth />
                <TextField label="Price" name="price" value={form.price} onChange={handleChange} fullWidth sx={{ mt: 2 }} />
              </>
            ) : (
              <>
                <Typography variant="h4">{data.name}</Typography>
                <Typography variant="h6">${parseFloat(data.price).toFixed(2)}</Typography>
              </>
            )}

            <Grid container spacing={2} paddingTop={4}>
              <Grid item>
                <Button
                  variant="outlined"
                  color={isEditing ? "success" : "primary"}
                  onClick={isEditing ? handleEditSubmit : () => setIsEditing(true)}
                >
                  {isEditing ? "Save" : "Edit"}
                </Button>
              </Grid>
              <Grid item>
              <Button
  variant="outlined"
  color="error"
  onClick={async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this contact?");
    if (confirmDelete) {
      try {
        await onDelete(data.contactID);    
        if (typeof onClose === "function") onClose(); 
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  }}
>
  Delete
</Button>

              </Grid>
            </Grid>
          </Grid>

          {/* Details */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {/* Left column */}
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Lens Details</Typography>
                {["brand", "model", "use", "visionType"].map((field) =>
                  isEditing ? (
                    <TextField
                      key={field}
                      label={field}
                      name={field}
                      value={form[field]}
                      onChange={handleChange}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                  ) : (
                    <Typography key={field}><b>{field}:</b> {data[field]}</Typography>
                  )
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Additional Info</Typography>
                {["daysSupply", "stockCount"].map((field) =>
                  isEditing ? (
                    <TextField
                      key={field}
                      label={field}
                      name={field}
                      value={form[field]}
                      onChange={handleChange}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                  ) : (
                    <Typography key={field}><b>{field}:</b> {data[field]}</Typography>
                  )
                )}
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

export default AdminEditContacts;

