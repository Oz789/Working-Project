import React, { useEffect, useRef, useState } from 'react';
import {
  Typography,
  Grid,
  Button,
  IconButton
} from '@mui/material';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import useCartStore from '../../components/cartStorage';
import { useNavigate } from 'react-router-dom';
import '../admin/frames/adminFrames.css';
import './userFramesModal.css';
import axios from 'axios';

const UserContactsModal = ({ data, onClose }) => {
  const { addToCart } = useCartStore();
  const navigate = useNavigate();
  const [stockQuantity, setStockQuantity] = useState(null);

  const {
    name,
    price,
    img,
    brand,
    model,
    visionType,
    use,
    daysSupply,
    waterContent
  } = data;

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/checkout/stock/contacts/${data.contactID}`);
        setStockQuantity(res.data.stockCount);
      } catch (err) {
        console.error("Failed to fetch contact stock:", err);
        setStockQuantity(-1);
      }
    };
    fetchStock();
  }, [data.contactID]);

  const handlePurchase = () => {
    const userID = localStorage.getItem("userID");
    if (!userID) {
      alert("You must be logged in to make a purchase.");
      return navigate("/log-in");
    }

    const existingItem = useCartStore.getState().cart.find(
      (item) => item.itemID === data.contactID && item.type === "contact"
    );
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    const newQuantity = currentQuantity + 1;

    if (stockQuantity === 0) {
      alert("This item is out of stock.");
      return;
    }

    if (newQuantity > stockQuantity) {
      alert(`Only ${stockQuantity} item(s) in stock. You already have ${currentQuantity} in your cart.`);
      return;
    }

    addToCart({
      itemID: data.contactID,
      name,
      price: parseFloat(price),
      quantity: 1,
      type: 'contact'
    });

    onClose();
  };

  return (
    <div className="modal">
      <div className="overlay" onClick={onClose}></div>
      <div className="modal-content">
        <Grid container spacing={2} padding={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h4" fontFamily="Bell MT" fontStyle="italic">{name}</Typography>
            <Typography variant="h6" sx={{ color: "#2e7d32", mt: 1 }}>${parseFloat(price).toFixed(2)}</Typography>

            <Grid container spacing={2} paddingTop={4}>
              <Grid item>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#388e3c" }}
                  onClick={handlePurchase}
                  disabled={stockQuantity === 0}
                >
                  Purchase
                </Button>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={6}>
            <img
              src={img || "/Images/default-contact.png"}
              alt="Contact Lens Box"
              style={{
                width: "100%",
                borderRadius: "10px",
                boxShadow: "0 8px 18px rgba(0, 0, 0, 0.1)"
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" fontFamily="Bell MT" fontStyle="italic">Supply Info</Typography>
                <Typography><b>Days Supply:</b> {daysSupply} days</Typography>
                <Typography>
                  <b>Stock:</b>{" "}
                  {stockQuantity === null
                    ? "Loading..."
                    : stockQuantity === 0
                    ? <span style={{ color: "red" }}>Out of stock</span>
                    : `${stockQuantity} in stock`}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="h6" fontFamily="Bell MT" fontStyle="italic">Specifications</Typography>
                <Typography><b>Brand:</b> {brand}</Typography>
                <Typography><b>Model:</b> {model}</Typography>
                <Typography><b>Vision Type:</b> {visionType}</Typography>
                <Typography><b>Use:</b> {use}</Typography>
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



