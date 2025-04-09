// PaymentForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./paymentForm.css";

function PaymentForm() {
  const { state } = useLocation();  // Retrieve the frames data passed from CartPage
  const navigate = useNavigate();

  const [paymentInfo, setPaymentInfo] = useState({
    cardName: "",
    cardNumber: "",
    cvv: "",
    expiry: "",
    address: "",
    address2: "",
    country: "United States",
    zipCode: "",
    city: "",
    state: "",
    email: "",
  });

  const [frameData, setFrameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (state && state.frames) {
      setFrameData(state.frames);  // Set frames data from the state passed by CartPage
      setLoading(false);
    } else {
      setError("No frames in the cart.");
      setLoading(false);
    }
  }, [state]);

  const handleChange = (e) => {
    setPaymentInfo({ ...paymentInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (frameData && frameData.length > 0) {
      console.log("Payment Info:", paymentInfo);
      console.log("Frame Data:", frameData);
      alert(`Payment processed successfully for ${frameData.map((frame) => frame.name).join(", ")}!`);
    } else {
      alert("Error: No frame data to process payment for.");
    }
  };

  if (loading) {
    return <div>Loading payment information...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!frameData || frameData.length === 0) {
    return <div>No items found in the cart. Please return to the frames page and try again.</div>;
  }

  return (
    <div className="payment-container">
      <h1>Payment Information for {frameData.map((frame) => frame.name).join(", ")}</h1>

      <form onSubmit={handleSubmit} className="payment-form">
        <fieldset>
          <legend>Payment Information</legend>
          <label>Cardholder's Name:</label>
          <input type="text" name="cardName" value={paymentInfo.cardName} onChange={handleChange} required />

          <label>Card Number:</label>
          <input type="text" name="cardNumber" value={paymentInfo.cardNumber} onChange={handleChange} required />

          <label>Card Security Code (CVV):</label>
          <input type="text" name="cvv" value={paymentInfo.cvv} onChange={handleChange} required />

          <label>Expiration Date:</label>
          <input type="month" name="expiry" value={paymentInfo.expiry} onChange={handleChange} required />
        </fieldset>

        <fieldset>
          <legend>Billing Information</legend>
          <label>Address Line 1:</label>
          <input type="text" name="address" value={paymentInfo.address} onChange={handleChange} required />

          <label>Address Line 2:</label>
          <input type="text" name="address2" value={paymentInfo.address2} onChange={handleChange} />

          <label>Country:</label>
          <select name="country" value={paymentInfo.country} onChange={handleChange}>
            <option>United States</option>
          </select>

          <label>ZIP Code:</label>
          <input type="text" name="zipCode" value={paymentInfo.zipCode} onChange={handleChange} required />

          <label>City:</label>
          <input type="text" name="city" value={paymentInfo.city} onChange={handleChange} />

          <label>State:</label>
          <input type="text" name="state" value={paymentInfo.state} onChange={handleChange} />
        </fieldset>

        <fieldset>
          <legend>Receipt Information</legend>
          <label>Email Address:</label>
          <input type="email" name="email" value={paymentInfo.email} onChange={handleChange} />
        </fieldset>

        <div className="form-buttons">
          <button type="submit">Continue</button>
          <button type="button" onClick={() => navigate("/frames")} className="exit-btn">Exit</button>
        </div>
      </form>
    </div>
  );
}

export default PaymentForm;
