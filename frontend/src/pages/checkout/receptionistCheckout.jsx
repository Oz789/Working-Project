import React, { useState, useEffect } from 'react';
import {
  Typography, Grid, Button, MenuItem, Select, TextField, Card, CardContent, Divider
} from '@mui/material';
import axios from 'axios';
import useCartStore from '../../components/cartStorage'; 


const ReceptionistCheckout = ({ patientID, appointmentNumber }) => {
  const [availableItems, setAvailableItems] = useState([]);
  const [itemType, setItemType] = useState("service");
  const [selectedItemID, setSelectedItemID] = useState("");

  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  } = useCartStore();

  // Fetch items for dropdowns
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const [services, frames, contacts] = await Promise.all([
          axios.get('http://localhost:5001/api/checkout/services'),
          axios.get('http://localhost:5001/api/checkout/frames'),
          axios.get('http://localhost:5001/api/checkout/contacts')
        ]);

        const combinedItems = [
          ...services.data.map(item => ({ ...item, type: 'service' })),
          ...frames.data.map(item => ({ ...item, type: 'frame' })),
          ...contacts.data.map(item => ({ ...item, type: 'contact' }))
        ];

        setAvailableItems(combinedItems);
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    };

    fetchItems();
  }, []);

  // Auto-add base service to cart if it exists
  useEffect(() => {
    if (!appointmentNumber) {
     
      return;
    }
  
    console.log("📡 Fetching checkout info for:", appointmentNumber);
    axios.get(`http://localhost:5001/api/checkout/${appointmentNumber}`)
      .then(res => {
        console.log("Appointment data received:", res.data);
        const data = res.data;
  
        if (data.baseService) {
          const exists = cart.find(
            item => item.itemID === data.baseService.serviceID && item.type === 'service'
          );
          if (!exists) {
            console.log("Adding base service to cart:", data.baseService);
            addToCart({
              itemID: data.baseService.serviceID,
              name: data.baseService.name,
              price: parseFloat(data.baseService.price),
              quantity: 1,
              type: 'service'
            });
          } else {
            console.log("⚠️ Base service already in cart.");
          }
        } else {
          console.log("No base service found in response.");
        }
      })
      .catch(err => {
        console.error("Failed to fetch appointment info:", err);
      });
  }, [appointmentNumber]);
  

  const handleAddItem = () => {
    const item = availableItems.find(i => i.itemID === selectedItemID);
    if (!item) return;

    const exists = cart.find(i => i.itemID === item.itemID && i.type === item.type);
    if (exists) {
      updateQuantity(item.itemID, item.type, exists.quantity + 1);
    } else {
      addToCart({ ...item, quantity: 1 });
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  const handleCheckout = async () => {
    try {
      const payload = {
        patientID,
        appointmentNumber,
        items: cart.map(item => ({
          itemID: item.itemID,
          itemType: item.type,
          quantity: item.quantity,
          price: item.price
        })),
        total: totalPrice
      };

      await axios.post('http://localhost:5001/api/checkout', payload);
      alert("Checkout successful!");
      clearCart();
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Checkout failed.");
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Receptionist Checkout
        </Typography>

        {/* Item Selection */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={3}>
            <Select value={itemType} onChange={e => setItemType(e.target.value)} fullWidth>
              <MenuItem value="service">Service</MenuItem>
              <MenuItem value="frame">Frame</MenuItem>
              <MenuItem value="contact">Contact</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={6}>
            <Select
              fullWidth
              value={selectedItemID}
              onChange={e => setSelectedItemID(e.target.value)}
            >
              {availableItems
                .filter(i => i.type === itemType)
                .map(i => (
                  <MenuItem key={i.itemID} value={i.itemID}>
                    {i.name} - ${i.price}
                  </MenuItem>
                ))}
            </Select>
          </Grid>
          <Grid item xs={3}>
            <Button onClick={handleAddItem} variant="contained">
              Add to Cart
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Cart Display */}
        <Typography variant="h6" gutterBottom>Cart</Typography>
        {cart.map((item, idx) => (
          <Grid container spacing={2} key={idx} alignItems="center">
            <Grid item xs={4}>{item.name}</Grid>
            <Grid item xs={2}>${item.price}</Grid>
            <Grid item xs={3}>
              <TextField
                type="number"
                size="small"
                value={item.quantity}
                onChange={e => updateQuantity(item.itemID, item.type, parseInt(e.target.value))}
              />
            </Grid>
            <Grid item xs={3}>
              <Button onClick={() => removeFromCart(item.itemID, item.type)} color="error">
                Remove
              </Button>
            </Grid>
          </Grid>
        ))}

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6">Total: ${totalPrice}</Typography>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleCheckout}
          sx={{ mt: 2 }}
        >
          Confirm & Save Bill
        </Button>
      </CardContent>
    </Card>
  );
};

export default ReceptionistCheckout;

