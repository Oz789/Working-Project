import React, { useState } from "react";
import ProfileTemplate from "../../components/profileTemplate";
import MsgManager from "../../components/msgManager";
import ReplyManager from "../../components/replyManager";

const EmployeeProfile = () => {

      const [patientData, setPatientData] = useState({
        name: "",
        email: "",
        dob: "",
        sex: "",
        address: "",
        phone: "",
        lastExamDate: "",
        usesCorrectiveLenses: "",
        usesContacts: "",
        lensesPrescription: "",
        contactsPrescription: "",
        lastPrescriptionDate: "",
        healthConcerns: "",
        otherConcerns: "",
        conditions: "",
        otherConditions: "",
        hadSurgery: "",
        surgeries: "",
        otherSurgeries: "",
        allergies: "",
        additionalDetails: "",
      });
    
      const [isEditing, setIsEditing] = useState(false);
    
      const [messager, setMessager] = useState(false);

      const toggleMessager = () => {
        setMessager(!messager)
        console.log(messager)
      }

      const handleChange = (e) => {
        setPatientData({ ...patientData, [e.target.name]: e.target.value });
      };

      const [ message, setMessage] = useState("null");
      const msgPasser = (m) => {
        setMessage(m);
      }

    return(

      // {messager && (

      <div>

        
       {!messager && ( <ProfileTemplate
      /* Left Sidebar (Patient Information) */
      
      sidebarContent={
        <div>
          <h2 className="section-title">John Doe</h2>
          <label>Name:</label>
          <input type="text" name="name" value={patientData.name} onChange={handleChange} className="input-field" readOnly={!isEditing} />
        </div>
      }

      /* Center Section (Medical Form Data) */
      mainContent={
        <div>
            
          <h2 className="section-title">Schedule</h2>
          <MsgManager
          bool={toggleMessager}
          pass={msgPasser}
          />

         
          
        </div>
      }

      /* Right Section (Extra Content, Placeholder for Now) */
      extraContent={
        <div>
        <h2 className="section-title"> Messages </h2>
        <p style={{ color: "#aaa", fontStyle: "italic" }}></p>
        </div>
      }
    />

  )}

  {messager && (

    <ReplyManager
    mes = {message}
    />

    
  )}
    </div>
    

    );

};

export default EmployeeProfile;