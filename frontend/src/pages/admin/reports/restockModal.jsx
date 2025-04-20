import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Divider,
} from "@mui/material";
import axios from "axios";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

const RestockFormModal = ({ item, onClose, onSuccess }) => {
  const [quantity, setQuantity] = useState(item?.suggestedQty || "");
  const [supplier, setSupplier] = useState("VisionSupply Co.");
  const [shippingSpeed, setShippingSpeed] = useState("standard");
  const [notes, setNotes] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    // Reset modal state each time a new item is opened
    setQuantity(item?.suggestedQty || "");
    setSupplier("VisionSupply Co.");
    setShippingSpeed("standard");
    setNotes("");
    setOrderPlaced(false);
  }, [item]);

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5001/api/most-purchased", {
        itemID: item.id,
        itemType: item.type,
        restockAmount: quantity,
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Restock failed:", err);
    }
  };

  const handleShippingAction = () => {
    if (shippingSpeed === "instant") {
      handleSubmit();
    } else {
      setOrderPlaced(true);
    }
  };

  return (
    <Modal open={!!item} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" gutterBottom>
          Restock Item
        </Typography>

        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
          {`${item.type.charAt(0).toUpperCase() + item.type.slice(1)} - ${item.brand} - ${
            item.name
          } - ${item.model}`}
        </Typography>

        <TextField
          label="Select Supplier"
          select
          fullWidth
          value={supplier}
          onChange={(e) => setSupplier(e.target.value)}
          sx={{ mb: 2 }}
        >
          <MenuItem value="VisionSupply Co.">VisionSupply Co.</MenuItem>
          <MenuItem value="ClearVision Logistics">ClearVision Logistics</MenuItem>
          <MenuItem value="Optix Partners">Optix Partners</MenuItem>
        </TextField>

        <TextField
          label="Shipping Speed"
          select
          fullWidth
          value={shippingSpeed}
          onChange={(e) => {
            setShippingSpeed(e.target.value);
            setOrderPlaced(false);
          }}
          sx={{ mb: 2 }}
        >
          <MenuItem value="instant">Instant (For Testing)</MenuItem>
          <MenuItem value="standard">Standard (5–7 days)</MenuItem>
          <MenuItem value="express">Express (2–3 days)</MenuItem>
          <MenuItem value="overnight">Overnight</MenuItem>
        </TextField>

        <TextField
          label="Restock Quantity"
          type="number"
          fullWidth
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Order Notes (optional)"
          multiline
          rows={3}
          fullWidth
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>

          {shippingSpeed === "instant" ? (
            <Button
              onClick={handleShippingAction}
              variant="contained"
              disabled={!quantity || parseInt(quantity) <= 0}
            >
              Confirm Restock
            </Button>
          ) : orderPlaced ? (
            <Typography sx={{ mt: 1 }} color="success.main">
              📦 Order placed. Shipment is on its way!
            </Typography>
          ) : (
            <Button
              onClick={handleShippingAction}
              variant="contained"
              disabled={!quantity || parseInt(quantity) <= 0}
            >
              Place Order
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default RestockFormModal;
