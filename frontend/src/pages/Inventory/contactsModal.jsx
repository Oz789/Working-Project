import React from 'react';
import {
  Typography,
  Grid,
  Button,
  IconButton
} from '@mui/material';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import useCartStore from '../../components/cartStorage'; // Zustand cart store
import '../admin/frames/adminFrames.css';
import './userFramesModal.css';

const UserContactsModal = ({ data, onClose }) => {
  const { addToCart } = useCartStore();

  const handlePurchase = () => {
    const cartItem = {
      itemID: data.contactID,
      name: data.name,
      price: parseFloat(data.price),
      type: "contact",
      quantity: 1
    };

    addToCart(cartItem);
    onClose();
  };

  return (
    <div className="modal">
      <div className="overlay"></div>
      <div className="modal-content">
        <Grid container spacing={2} padding={2}>
          {/* LEFT SIDE */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h4" sx={{ fontFamily: "Bell MT", fontStyle: "italic" }}>
              {data.name}
            </Typography>
            <Typography variant="h6" sx={{ fontFamily: "Bell MT", fontStyle: "italic", color: "#00796B" }}>
              ${parseFloat(data.price).toFixed(2)}
            </Typography>

            <Grid container spacing={2} paddingTop={4}>
              <Grid item>
                <Button variant="contained" color="success" onClick={handlePurchase}>
                  Purchase
                </Button>
              </Grid>
            </Grid>
          </Grid>

          {/* RIGHT SIDE - IMAGE */}
          <Grid item xs={12} md={6}>
            <img
              src={data.image || "/Images/contact-placeholder.webp"}
              alt="Contact"
              style={{
                width: "100%",
                borderRadius: "10px",
                boxShadow: "0 8px 18px rgba(0, 0, 0, 0.1)",
              }}
            />
          </Grid>

          {/* BOTTOM SECTION */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" sx={{ fontFamily: "Bell MT", fontStyle: "italic" }}>
                  Specs
                </Typography>
                <Typography><b>Brand:</b> {data.brand}</Typography>
                <Typography><b>Model:</b> {data.model}</Typography>
                <Typography><b>Vision Type:</b> {data.visionType}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" sx={{ fontFamily: "Bell MT", fontStyle: "italic" }}>
                  Usage
                </Typography>
                <Typography><b>Use:</b> {data.use}</Typography>
                <Typography><b>Water Content:</b> {data.waterContent}%</Typography>
                <Typography><b>Days Supply:</b> {data.daysSupply} days</Typography>
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

export default UserContactsModal;

