import React, { useEffect, useState } from 'react';
import ReceptionistCheckout from '../pages/checkout/receptionistCheckout';
import useBillingSessionStore from '../pages/billing/appointmentBilling';
import NavBar from "./navBar";

const CheckoutPage = () => {
  const { appointmentNumber, patientID } = useBillingSessionStore();
  const [ready, setReady] = useState(false);


  console.log("   appointmentNumber:", appointmentNumber);
  console.log("   patientID:", patientID);

  useEffect(() => {
    if (appointmentNumber && patientID) {
      setReady(true);
    } else {

    }
  }, [appointmentNumber, patientID]);

  return (
    <>
      <NavBar />
      <div style={{ padding: '2rem' }}>
        {!ready ? (
          <h2 style={{ textAlign: 'center' }}>Loading appointment info...</h2>
        ) : (
          <ReceptionistCheckout
            appointmentNumber={appointmentNumber}
            patientID={patientID}
          />
        )}
      </div>
    </>
  );
};

export default CheckoutPage;

