import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Grid,
  Typography,
  Button,
  Box
} from "@mui/material";
import axios from "axios";
import AdminCreateContactModal from "./adminCreateContacts";
import AdminNavbar from "../../../components/navBar";
import AdminEditContacts from "./adminEditContacts";
import "./adminContactsPage.css";


const AdminContactsTab = () => {
    const [contacts, setContacts] = useState([]);
    const [modal, setModal] = useState(false);
    
    
    const [viewModal, setViewModal] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);

  const fetchContacts = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/eyeContacts");
          setContacts(res.data);
    } catch (error) {
      console.error("Failed to fetch contacts", error);
    }
  };

  const handleCreate = async (newContact) => {
    try {
      await axios.post("http://localhost:5001/api/createContact", newContact);
      
      
      setModal(false);
      fetchContacts();
    } catch (error) {
      console.error("Error creating contact:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/contacts/${id}`);
      setViewModal(false);

      fetchContacts();
      console.log("Deleted contact lens:", id);
    } catch (error) {
      console.error("Error deleting contact lens:", error);
    }
  };
  

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div>
           <Grid sx={{ paddingLeft: 4, paddingTop: 2 }}>
      <div>
  <Typography
    variant="subtitle1"
    sx={{
      fontFamily: "Serif",
      fontSize: "20px",
      textAlign: "center",
      flexGrow: 1
    }}
  >
    Showing {contacts.length} Products
  </Typography>
  </div>
        

  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <Button
      variant="contained"
      color="primary"
      onClick={() => setModal(true)}
      sx={{
        minWidth: 0,
        width: 48,
        height: 48,
        borderRadius: "50%",
        fontSize: "1.5rem",
        fontWeight: "bold",
        lineHeight: 1,
        boxShadow: 2,
      }}
    >
      +
    </Button>
    <Typography
      variant="subtitle1"
      sx={{ fontFamily: "Bell MT, serif", fontWeight: 500 }}
    >Add a Product
    </Typography>
  </Box>
  </Grid>

      <Grid container spacing={2} justifyContent="center" sx={{ padding: 2 }}>

        {contacts.map((lens) => (
          <Grid item key={lens.contactID} minWidth={100}>
            <Card className="admin-contact-card">
  <CardActionArea onClick={() => {
    setSelectedContact(lens);
    setViewModal(true);
  }}>

    
    {/* Change Image */ } 
    <CardMedia
      component="img"
image="/Images/1_DAY_ACUVUE_MOIST_90_Pack.avif"  
      alt="Contact Lens"
      className="admin-contact-image"
    />
    <div className="admin-contact-details">
      <Typography variant="h6" fontFamily="Roboto">
        {lens.name}
      </Typography>
      <Typography variant="h6" fontWeight="bold">
        ${parseFloat(lens.price).toFixed(2)}
      </Typography>
    </div>
  </CardActionArea>
</Card>

          </Grid>
        ))}
      </Grid>

      {modal && (
        <AdminCreateContactModal
          toggleModal={() => setModal(false)}
          onSubmit={handleCreate}
        />
      )}

{viewModal && selectedContact && (
  <AdminEditContacts
    data={selectedContact}
    onClose={() => setViewModal(false)}
    onEdit={() => {
      fetchContacts();    
      setViewModal(false);   
    }}
    
    onDelete={handleDelete}
  />
)}

    </div>
  );
};

export default AdminContactsTab;