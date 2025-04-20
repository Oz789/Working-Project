import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useCartStore from '../../components/cartStorage';
import './checkout.css'; // reuse user style
import { useNavigate, useParams } from 'react-router-dom';


const ReceptionistCheckout = ({ appointmentNumber: propAppt, patientID: propPatient }) => {
  const [availableItems, setAvailableItems] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [cardDetails, setCardDetails] = useState({ name: '', number: '', expiry: '', cvv: '' });
  const [errors, setErrors] = useState({});

  const { cart, addToCart, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const navigate = useNavigate();

  const receptionistID = localStorage.getItem("userID");
  const appointmentNumber = propAppt || localStorage.getItem("checkoutAppt");
  const patientID = propPatient || localStorage.getItem("checkoutPatient");

  useEffect(() => {
    if (propAppt) localStorage.setItem("checkoutAppt", propAppt);
    if (propPatient) localStorage.setItem("checkoutPatient", propPatient);
  }, [propAppt, propPatient]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const [services, frames, contacts] = await Promise.all([
          axios.get('http://localhost:5001/api/checkout/items/services'),
          axios.get('http://localhost:5001/api/checkout/items/frames'),
          axios.get('http://localhost:5001/api/checkout/items/contacts')
        ]);

        const combined = [
          ...services.data.map(item => ({ ...item, type: 'service' })),
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

  useEffect(() => {
    if (!appointmentNumber) return; 
    axios.get(`http://localhost:5001/api/checkout/${appointmentNumber}`)
      .then(res => {
        const base = res.data.baseService;
        if (base && !cart.some(item => item.itemID === base.serviceID && item.type === 'service')) {
          addToCart({ itemID: base.serviceID, name: base.name, price: +base.price, quantity: 1, type: 'service' });
        }
      })
      .catch(err => console.error("Failed to fetch base service:", err));
  }, [appointmentNumber]);
  

  const handleAdd = (item) => {
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
        appointmentNumber,
        items: cart.map(item => ({
          itemID: item.itemID,
          itemType: item.type,
          quantity: item.quantity,
          price: item.price
        })),
        total: totalPrice
      };

      await axios.post('http://localhost:5001/api/finalize-checkout', payload);
      alert("Checkout successful!");
      clearCart();
      localStorage.removeItem("cart-storage");
      setShowPayment(false);
      navigate(`/employeeProfile/${receptionistID}`);
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Checkout failed.");
    }
  };

  const handleCardInput = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="checkout-wrapper">
      <h2>Receptionist Checkout</h2>

   
      <div className="cart-section">
        <h3>Cart</h3>
        {cart.map((item, idx) => (
          <div key={idx} className="cart-row">
            <span>{item.name}</span>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => updateQuantity(item.itemID, item.type, +e.target.value)}
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

            <input name="name" placeholder="Cardholder Name" value={cardDetails.name} onChange={handleCardInput} />
            {errors.name && <small style={{ color: "red" }}>{errors.name}</small>}

            <input name="number" placeholder="1234 5678 9012 3456" maxLength={19}
              value={cardDetails.number}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^\d]/g, '');
                const formatted = raw.replace(/(.{4})/g, '$1 ').trim();
                setCardDetails(prev => ({ ...prev, number: formatted }));
              }}
            />
            {errors.number && <small style={{ color: "red" }}>{errors.number}</small>}

            <input name="expiry" placeholder="MM/YY" maxLength={5}
              value={cardDetails.expiry}
              onChange={(e) => {
                let raw = e.target.value.replace(/[^\d]/g, '');
                if (raw.length > 2) raw = raw.slice(0, 2) + '/' + raw.slice(2);
                setCardDetails(prev => ({ ...prev, expiry: raw }));
              }}
            />
            {errors.expiry && <small style={{ color: "red" }}>{errors.expiry}</small>}

            <input name="cvv" placeholder="CVV" maxLength={4}
              value={cardDetails.cvv}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, '');
                setCardDetails(prev => ({ ...prev, cvv: raw }));
              }}
            />
            {errors.cvv && <small style={{ color: "red" }}>{errors.cvv}</small>}

            <button className="confirm-btn" onClick={handleFinalCheckout}>
              Confirm & Save Bill
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceptionistCheckout;



