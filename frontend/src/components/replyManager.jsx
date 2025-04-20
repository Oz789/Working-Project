import React, {useEffect, useState} from 'react'
import { Grid2 } from '@mui/material';
import axios from 'axios'
import "./replyManager.css"


import EmailBox from './emailBox';


const ReplyManager = (props) => {


  

  const [recipientInfo, setRecipientInfo] = useState({
    roleLabel: 'employee', // default fallback
  });

  useEffect(() => {
    console.log(props.mes.sender_id + " props.mes.sender_type: " + props.mes.sender_type)


    const fetchRecipientType = async () => {
      try {
        const email = props.mes.email;
        const e = 25;
        
        if(props.mes.sender_type === 'employee')
          {
            let res = await axios.get(`http://localhost:5001/api/employees/${props.mes.sender_id}`); //props.mes.sender_id
            console.log(res);
            if (res.data) {
              console.log("Apparent Name: " + res.data.role);
            setRecipientInfo({
              roleLabel: res.data.role || 'employee',
            });
            }
          }
         else {
         
            setRecipientInfo({
              roleLabel: 'patient',
            });
          
        }
      } catch (err) {
        console.error("Error fetching recipient type", err);
      }
    };

    if (props.mes.sender_type) {
      fetchRecipientType();
    }
  }, [props.mes.sender_type]); //?

    const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
    const [status, setStatus] = useState("");
  
    // Handle form input changes
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    // Submit form
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        console.log("Sending data to the server:", formData); // Debug: log form data
        const res = await axios.post("http://localhost:5001/api/submit-form", formData);
        setStatus(res.data.message);
        setFormData({ name: "", email: "", phone: "", message: "" }); // Reset form
      } catch (error) {
        console.error("Error submitting form:", error); // Debug: log error
        if (error.response) {
          console.error("Error response:", error.response.data); // Log error response from server
          setStatus(error.response.data.error || "Error submitting form. Please try again.");
        } else {
          setStatus("Error submitting form. Please try again.");
        }
      }
    };

    console.log(props.mes.name)
    return(
        <div>

          
        
        

        <div className="container">
            
            <div className="wrapper-vertical">
            <div className="wrapper-header">Compose a Response</div>

            <div className="wrapper">
                <div className="reply">
                  
                <EmailBox  defaultRecipient={{
    id: props.mes.id,
    email: props.mes.email,
    label: props.mes.name
      ? `${props.mes.name} (${props.mes.email})`
      : `${props.mes.email}`,
    type: recipientInfo.roleLabel,
    fixed: true,
    firstName: props.mes.name?.split(' ')[0] || '',
    lastName: props.mes.name?.split(' ')[1] || ''
  }}/>
                <div className="w-1/2 flex justify-end">
                
                
            {/* <form onSubmit={handleSubmit} className="form-container w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Send A Message</h2>

              <input type="text" name="name" value={formData.name} onChange={handleChange} className="textbox w-full mb-4" placeholder="Name" required />
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="textbox w-full mb-4" placeholder="Email" required />
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="textbox w-full mb-4" placeholder="Phone" />
              <textarea name="message" value={formData.message} onChange={handleChange} className="textarea w-full mb-4" placeholder="Message" required></textarea>

              <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded blued">Send</button>

              {status && <p className="mt-4 text-green-600">{status}</p>}
            </form> */}
          </div>

                </div>

                <div className="msg">
                <h5 className="heading"> <b>From: </b>{props.mes.email} </h5>
                <h5 className="subheading"> 
  <b> By: </b>{props.mes.name}, {recipientInfo.roleLabel}
</h5>
                <hr className="solid"/>
                <h5 >  {props.mes.message}</h5>
                {/* <p style={{ color: "#aaa", fontStyle: "italic" }}> {props.mes.email}</p> */}
                </div>
            </div>

        </div>
        </div>

        <div style={{ padding: '1rem' }}>
  <button onClick={props.goBack} className="back-button">
    ← Back to Inbox
  </button>
</div>

        </div>

    );

};

export default ReplyManager;