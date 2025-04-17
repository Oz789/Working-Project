import React, { useEffect, useState } from 'react';
import {
  Typography, Grid, Button, MenuItem, Select, TextField, Card, CardContent, Divider
} from '@mui/material';
import axios from 'axios';
import useCartStore from '../../components/cartStorage';
import NavBar from '../../components/navBar';

const UserCheckout = () => {
  const [availableItems, setAvailableItems] = useState([]);
  const [itemType, setItemType] = useState("frame");
  const [selectedItemID, setSelectedItemID] = useState("");
  const patientID = localStorage.getItem("userID");

  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  } = useCartStore();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const [frames, contacts] = await Promise.all([
          axios.get('http://localhost:5001/api/checkout/frames'),
          axios.get('http://localhost:5001/api/checkout/contacts')
        ]);

        const combinedItems = [
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
            items: cart.map(item => ({
              itemID: item.itemID,
              itemType: item.type,
              quantity: item.quantity,
              price: item.price,
            })),
            total: totalPrice,
          };

      await axios.post("http://localhost:5001/api/checkout/user", payload);

      alert("Purchase complete!");
      clearCart();
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Checkout failed.");
    }
  };

  return (

    <>
    <NavBar/>
    <Card sx={{ p: 3, mt: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>User Checkout</Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={3}>
            <Select value={itemType} onChange={e => setItemType(e.target.value)} fullWidth>
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
            <Button onClick={handleAddItem} variant="contained">Add to Cart</Button>
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
          Confirm Purchase
        </Button>
      </CardContent>
    </Card>
    </>
  );
};

export default UserCheckout;
