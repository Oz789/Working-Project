// CartPage.jsx
import React from 'react';
import { useCart } from '../context/CartContext'; 
import { Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cart.length > 0) {
      navigate('/checkout', { state: { frames: cart } }); 
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4">Your Cart</Typography>
      {cart.length === 0 ? (
        <Typography>No items in cart.</Typography>
      ) : (
        cart.map((item, index) => (
          <Box key={index} mt={2} p={2} border="1px solid #ccc" borderRadius={2}>
            <Typography variant="h6">{item.name}</Typography>
            <Typography>Price: ${item.price}</Typography>
            <Button onClick={() => removeFromCart(item.frameID)}>Remove</Button>
          </Box>
        ))
      )}
      {cart.length > 0 && (
        <Button variant="contained" color="primary" onClick={handleCheckout}>
          Proceed to Checkout
        </Button>
      )}
    </Box>
  );
};

export default CartPage;
