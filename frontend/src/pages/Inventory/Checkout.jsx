import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PaymentForm from "./PaymentForm";

function Checkout() {
  const { state } = useLocation(); // Get frame and prescription data passed from PrescriptionForm
  const navigate = useNavigate();

  useEffect(() => {
    console.log(state); // Log the state (frame, prescription, paymentPlan)
  }, [state]);

  return (
    <div>
      <h1>Payment Information for {state.frame.name}</h1>
      <h2>Prescription: {state.prescription}</h2>
      <h3>Payment Plan: {state.paymentPlan}</h3>
      <PaymentForm />
      <br />
      <button onClick={() => navigate("/frames")}>Back to Frames</button>
    </div>
  );
}

export default Checkout;
