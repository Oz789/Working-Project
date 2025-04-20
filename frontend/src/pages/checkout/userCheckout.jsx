import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useCartStore from '../../components/cartStorage';
import NavBar from '../../components/navBar';
import './checkout.css';

const UserCheckout = () => {
  const [availableItems, setAvailableItems] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: ''
  });
  const [errors, setErrors] = useState({});
  const patientID = localStorage.getItem("userID");

  const { cart, addToCart, removeFromCart, updateQuantity, clearCart } = useCartStore();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const [frames, contacts] = await Promise.all([
          axios.get('http://localhost:5001/api/checkout/items/frames'),
          axios.get('http://localhost:5001/api/checkout/items/contacts')
        ]);

        const combined = [
          ...frames.data.map(item => ({ ...item, type: 'frame' })),
          ...contacts.data.map(item => ({ ...item, type: 'contact' }))
        ];
        setAvailableItems(combined);
      } catch (err) {
        console.error("Item fetch error:", err);
      }
    };

    fetchItems();
  }, []);

  const handlePurchase = (item) => {
    const exists = cart.find(i => i.itemID === item.itemID && i.type === item.type);
    if (exists) {
      updateQuantity(item.itemID, item.type, exists.quantity + 1);
    } else {
      addToCart({ ...item, quantity: 1 });
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  const validateCard = () => {
    const errs = {};
    if (!cardDetails.name.trim()) errs.name = "Name required";
    if (!/^\d{4} \d{4} \d{4} \d{4}$/.test(cardDetails.number)) errs.number = "Card number must be 16 digits";
    if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) errs.expiry = "Use MM/YY format";
    if (!/^\d{3,4}$/.test(cardDetails.cvv)) errs.cvv = "CVV must be 3 or 4 digits";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFinalCheckout = async () => {
    if (!validateCard()) return;

    try {
      const payload = {
        patientID,
        items: cart.map(item => ({
          itemID: item.itemID,
          itemType: item.type,
          quantity: item.quantity,
          price: item.price
        })),
        total: totalPrice
      };

      await axios.post('http://localhost:5001/api/finalize-checkout', payload);
      alert("Purchase successful!");
      clearCart();
      localStorage.removeItem("cart-storage");
      setShowPayment(false);
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Checkout failed.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <NavBar />
      <div className="checkout-wrapper">
     

        <div className="cart-section">
          <h3>Your Cart</h3>
          {cart.map((item, idx) => (
            <div key={idx} className="cart-row">
              <span>{item.name}</span>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.itemID, item.type, parseInt(e.target.value))}
              />
              <span>${item.price}</span>
              <button onClick={() => removeFromCart(item.itemID, item.type)}>Remove</button>
            </div>
          ))}

          <div className="cart-total">Total: ${totalPrice}</div>

          {!showPayment ? (
            <button className="checkout-btn" onClick={() => setShowPayment(true)}>Checkout</button>
          ) : (
            <div className="payment-form">
              <h4>Enter Payment Info</h4>

              <input
                type="text"
                name="name"
                placeholder="Cardholder Name"
                maxLength={40}
                value={cardDetails.name}
                onChange={handleInputChange}
              />
              {errors.name && <small style={{ color: "red" }}>{errors.name}</small>}

              <input
                type="text"
                name="number"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                value={cardDetails.number}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^\d]/g, '');
                  const formatted = raw.replace(/(.{4})/g, '$1 ').trim();
                  setCardDetails(prev => ({ ...prev, number: formatted }));
                }}
              />
              {errors.number && <small style={{ color: "red" }}>{errors.number}</small>}

              <input
                type="text"
                name="expiry"
                placeholder="MM/YY"
                maxLength={5}
                value={cardDetails.expiry}
                onChange={(e) => {
                  let input = e.target.value.replace(/[^\d]/g, '');
                  if (input.length > 2) {
                    input = input.slice(0, 2) + '/' + input.slice(2);
                  }
                  setCardDetails(prev => ({ ...prev, expiry: input }));
                }}
              />
              {errors.expiry && <small style={{ color: "red" }}>{errors.expiry}</small>}

              <input
                type="text"
                name="cvv"
                placeholder="CVV"
                maxLength={4}
                value={cardDetails.cvv}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '');
                  setCardDetails(prev => ({ ...prev, cvv: raw }));
                }}
              />
              {errors.cvv && <small style={{ color: "red" }}>{errors.cvv}</small>}

              <button className="confirm-btn" onClick={handleFinalCheckout}>
                Confirm Purchase
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserCheckout;



