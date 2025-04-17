import React, { useState, useEffect } from 'react';
import {
  Typography, Grid, Button, MenuItem, Select, TextField, Card, CardContent, Divider
} from '@mui/material';
import axios from 'axios';
import useCartStore from '../../components/cartStorage'; 
import { useNavigate } from 'react-router-dom';


const ReceptionistCheckout = (props) => {
  const initialAppointmentNumber = props.appointmentNumber || localStorage.getItem("checkoutAppt");
  const initialPatientID = props.patientID || localStorage.getItem("checkoutPatient");

  const [appointmentNumber, setAppointmentNumber] = useState(initialAppointmentNumber);
  const [patientID, setPatientID] = useState(initialPatientID);

  console.log(" Initial props:", props);
  console.log("Final appointmentNumber:", appointmentNumber);
  console.log("Final patientID:", patientID);

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

  useEffect(() => {
    if (props.appointmentNumber) {
      localStorage.setItem("checkoutAppt", props.appointmentNumber);
    }
    if (props.patientID) {
      localStorage.setItem("checkoutPatient", props.patientID);
    }
  }, [props.appointmentNumber, props.patientID]);

  // Fetch items
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

        console.log("🛒 Combined items fetched:", combinedItems);
        setAvailableItems(combinedItems);
      } catch (err) {
        console.error("❌ Error fetching items:", err);
      }
    };

    fetchItems();
  }, []);

  // Auto-add base service
  useEffect(() => {
    if (!appointmentNumber) {
      console.warn("⚠️ No appointmentNumber — cannot fetch base service.");
      return;
    }

    console.log("📡 Fetching checkout info for:", appointmentNumber);
    axios.get(`http://localhost:5001/api/checkout/${appointmentNumber}`)
      .then(res => {
        console.log("📬 Appointment data received:", res.data);
        const data = res.data;

        if (data.baseService) {
          const exists = cart.find(
            item => item.itemID === data.baseService.serviceID && item.type === 'service'
          );
          if (!exists) {
            console.log("✅ Adding base service to cart:", data.baseService);
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
          console.log("ℹ️ No base service returned.");
        }
      })
      .catch(err => {
        console.error("❌ Failed to fetch appointment info:", err);
      });
  }, [appointmentNumber]);

  const handleAddItem = () => {
    const item = availableItems.find(i => i.itemID === selectedItemID);
    if (!item) {
      console.warn("⚠️ Tried to add item, but none selected.");
      return;
    }

    const exists = cart.find(i => i.itemID === item.itemID && i.type === item.type);
    if (exists) {
      updateQuantity(item.itemID, item.type, exists.quantity + 1);
      console.log(`🔁 Increased quantity for ${item.name}`);
    } else {
      addToCart({ ...item, quantity: 1 });
      console.log(`🆕 Added to cart:`, item);
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  const navigate = useNavigate();

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
  
      console.log("🧾 Sending checkout payload:", payload);
  
      const res = await axios.post('http://localhost:5001/api/checkout', payload);
      console.log("✅ Checkout response:", res.data);
  
      alert("✅ Sale complete and appointment marked as finished!");
  
      clearCart();
      localStorage.removeItem("cart-storage");
  
      setSelectedItemID("");
      setAvailableItems([]);
  
      setTimeout(() => {
        navigate("/employeeProfile"); // 👈 Use navigate instead of window.location.href
      }, 750);
  
    } catch (err) {
      console.error("❌ Checkout error:", err);
      alert("Checkout failed.");
    }
  };
  
  
  
  

  return (
    <Card sx={{ p: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Receptionist Checkout
        </Typography>

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


