import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
//import "./patientProfile.css";
import NavBar from "../../components/navBar";
import MsgManager from "../../components/msgManager";


const PatientInbox = () => {

    return (
        <div>
        <NavBar />
        <MsgManager/>
        </div>
    );
}

export default PatientInbox;