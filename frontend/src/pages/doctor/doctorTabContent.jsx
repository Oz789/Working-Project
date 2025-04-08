import React, { useState } from "react";


// import other tab content 

const DoctorTabContent = ({ activeTab,doctor }) => {

  const toggleMessager = () => {
    setMessager(!messager)
    console.log(messager)

  }
  const [messager, setMessager] = useState(false);
  const [ message, setMessage] = useState("null");
  const msgPasser = (m) => {
    setMessage(m);
  }
  switch (activeTab) {
  
    case 0:
        return (
            <div style={{ padding: 16 }}>
            <h3>Doctor Overview</h3>
            <p><strong>Name:</strong> {doctor.firstName} {doctor.lastName}</p>
            <p><strong>Email:</strong> {doctor.email}</p>
            <p><strong>Phone:</strong> {doctor.phone}</p>
            <p><strong>Specialization:</strong> {doctor.specialization}</p>
          </div>
        )
    case 1:
      return;
    case 2:
      return;
    case 3:
      return;
    case 4:
   return ;
    default:
      return null;
  }
};

export default DoctorTabContent;