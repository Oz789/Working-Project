import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { Button, Grid2 } from '@mui/material';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid'; 
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { set } from 'date-fns';
import { useParams } from 'react-router-dom';
import ReplyManager from './replyManager'; 
import ComposeManager from './composeManager';




const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001',
});
const theme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          '& .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
          '& .MuiDataGrid-cell:focus-within': {
            outline: 'none',
          },
        },
      },
    },
  },
});
const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'email',
      headerName: 'E-mail',
      width: 150,
      editable: true,
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 150,
      editable: true,
    },
    {
      field: 'subject',
      headerName: 'Subject',
      width: 300,
    },
    {
      field: 'created_at',
      headerName: 'Message Created At',
      width: 150,
      editable: true,
    },

  ];

  const MsgManager = () => {

    const { employeeID, patientID } = useParams();
    const senderId = employeeID || patientID;
    let   [buffer2, setBuffer2] = useState("null")
    const [entry, SetEntry] = useState([]);
    const [msg, SetMsg] = useState("null");
    const [gate, setGate] = useState(false);
    const [userType, setUserType] = useState(null);
    const [inboxView, setInboxView] = useState(null);

    const [selectedRecipients, setSelectedRecipients] = useState([]);

      useEffect(() => {
        if (employeeID) 
        {
          setUserType('employee');
          setInboxView('focused');

        }
        else if (patientID) 
        { 
          setUserType('patient');
        setInboxView('all');
        }
      }, [employeeID, patientID]);

      useEffect(() => {
        const senderType = employeeID ? 'employee' : 'patient';
        if (!senderId) return;
      
        let endpoint = 'http://localhost:5001/api/mess/user'; // default "all"

        if (inboxView === 'focused') {
          endpoint = 'http://localhost:5001/api/mess/unresponded';
        } else if (inboxView === 'sent') {
          endpoint = 'http://localhost:5001/api/mess/sent';
        }
      
        axios.post(endpoint, {
          id: senderId,
          type: senderType,
        })
        .then((response) => SetEntry(response.data))
        .catch((error) => console.error("Error fetching messages:", error));
      
      }, [inboxView, senderId]);

    const toggleGate = () => {
      setGate(!gate)
    }

    // useEffect(() => {
    //   axios.get('http://localhost:5001/api/messages')
    //   .then((response) => SetEntry(response.data))
    //   .catch((error) => console.error("Error fetching messages:", error));
    // }, []);
   
    const msgList = [...entry];
    const rows = msgList.map(item => ({
      id: item.id,
      name: item.name,
      email: item.email,
      subject: item.subject,
      created_at: new Date(item.created_at).toLocaleDateString('en-TX') // YYYY-MM-DD
    }));
      
      const handleRowClick = (params) => {
        const clickedRow = params.row;
        console.log('Clicked row data:', clickedRow.email);
        SetMsg(msgList.find( element => element.id === clickedRow.id)) //should be grabbing clicked row ver instead, using element leads to curr problematic shi
        toggleGate()
        //props.pass(msg);
        //props.bool();
        //let test = props.setMessager()
        // Access specific values:
        // const name = clickedRow.name;
        // const age = clickedRow.age;
      };
    

    return(

      //{msg !== null && ()}

<Box sx={{ pt: 0, pr: 2, pb: 0, pl: 0, flexGrow: 1 }}>
  {!gate ? (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: 2,
          minHeight: userType === 'patient' ? '87vh' : '75vh', // allows for growable container
        }}
      >
        {/* Sidebar */}
        <Box
  sx={{
    width: 200,
    bgcolor: '#f9f9f9',
    borderRight: '1px solid #e0e0e0',
    p: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  }}
>
  <h4 style={{ margin: '0 0 8px 0' }}>Messages</h4>

  {userType === 'employee' && (
    <Button
      variant={inboxView === 'focused' ? 'contained' : 'text'}
      onClick={() => setInboxView('focused')}
      sx={{ justifyContent: 'flex-start' }}
    >
      Focused
    </Button>
  )}

  <Button
    variant={inboxView === 'all' ? 'contained' : 'text'}
    onClick={() => setInboxView('all')}
    sx={{ justifyContent: 'flex-start' }}
  >
    All
  </Button>
  <Button
    variant={inboxView === 'sent' ? 'contained' : 'text'}
    onClick={() => setInboxView('sent')}
    sx={{ justifyContent: 'flex-start' }}
  >
    Sent
  </Button>
</Box>

        {/* DataGrid + Compose */}
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ flexGrow: 1, height: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              pageSizeOptions={[10]}
              disableRowSelectionOnClick
              onRowClick={handleRowClick}
              sx={{
                border: 'none',
                borderLeft: '1px solid #e0e0e0',
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid #f0f0f0',
                },
              }}
            />
          </Box>

          {/* Compose Button with padding below */}
          <Box sx={{ px: 2, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  {userType === 'employee' ? (
    <span style={{ fontSize: '0.95rem', color: '#555' }}>
      Focused contains messages by patients that need a response.
    </span>
  ) : (
    <span style={{ visibility: 'hidden' }}>placeholder</span>  // maintain layout
  )}

  <Button 
    variant="contained" 
    color="primary"
    onClick={() => {
      setGate(true);
      SetMsg(null); 
    }}
  >
    Compose
  </Button>
</Box>
        </Box>
      </Box>
    </ThemeProvider>
  ) : (
    msg ? <ReplyManager mes={msg} goBack={() => setGate(false)} /> : <ComposeManager senderId={senderId} senderType={userType} goBack={() => setGate(false)} />
  )}
</Box>
    );

};


export default MsgManager;
