import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TextField, Button, Box } from '@mui/material';
import EmployeeEmailSelector from '../pages/emails/employeeEmailSelector';
import UniversalEmailSelector from '../pages/emails/universalEmailSelector';
import axios from 'axios'

const EmailBox = ({defaultRecipient}) => {
  const { employeeID, patientID } = useParams();
  const senderId = employeeID || patientID;
  console.log("Sender ID:", senderId);
  const [userType, setUserType] = useState(null); // 'employee' or 'patient'
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    if (employeeID) setUserType('employee');
    else if (patientID) setUserType('patient');
  }, [employeeID, patientID]);

  useEffect(() => {
    if (defaultRecipient && selectedRecipients.length === 0) {
      setSelectedRecipients([defaultRecipient]);
    }
  }, [defaultRecipient, selectedRecipients]);

  const handleSubmit = async () => {
    const recipients = selectedRecipients.map(r => r.email || 'all-receptionists');
    const payload = {
      senderId: senderId,
      recipients,
      subject,
      message: body
    };
  
    try {
      const res = await fetch('http://localhost:5001/api/sendmsg/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
  
      if (!res.ok) {
        alert('Failed to send message');
        return;
      }
  
      const data = await res.json();
      console.log("Server response:", data);
      alert("Message sent successfully!");
      
      if (defaultRecipient) {
        await axios.post('http://localhost:5001/api/responded', {
          messageId: defaultRecipient.id,
          recipientId: senderId,
          recipientType: userType
        });
      }
      // Optionally reset form fields here
      setSelectedRecipients([]);
      setSubject('');
      setBody('');
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    }
  };
  
  const SelectorComponent = userType === 'employee' ? UniversalEmailSelector : EmployeeEmailSelector;
  const isValid = subject.trim() !== '' && selectedRecipients.length > 0;
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, px: 2 }}>
      {userType && (
        <SelectorComponent
          selectedRecipients={selectedRecipients}
          setSelectedRecipients={setSelectedRecipients}
        />
      )}

      <TextField
        variant="standard"
        fullWidth
        placeholder="Subject Required*"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        sx={{
          mt: 3,
          '& .MuiInputBase-root': {
            borderBottom: '2px solid #ccc',
            borderRadius: 0,
            paddingBottom: '4px',
            '&:hover': {
              borderBottom: '2px solid #999',
            },
            '&.Mui-focused': {
              borderBottom: '2px solid #1976d2',
            },
          },
        }}
        InputProps={{ disableUnderline: false }}
      />

      <TextField
        multiline
        minRows={8}
        maxRows={16}
        fullWidth
        placeholder="Type your message here..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        sx={{
          mt: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: 1,
            backgroundColor: '#fafafa',
            border: '1px solid #ddd',
            '&:hover': {
              borderColor: '#bbb',
            },
            '&.Mui-focused': {
              borderColor: '#1976d2',
            },
          },
        }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={!isValid}
        sx={{ mt: 3 }}
      >
        Send Email
      </Button>
    </Box>
  );
};

export default EmailBox;
