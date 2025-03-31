import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Grid,
  Typography,
  Button
} from "@mui/material";
import axios from "axios";
import AdminCreateContactModal from "./adminContactsModal";
import AdminNavbar from "../../../components/navBar";

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [modal, setModal] = useState(false);

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

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div>
      <AdminNavbar />
      <Grid sx={{ paddingLeft: 4, paddingTop: 2 }}>
        <Typography variant="h3">Contact Lenses</Typography>
        <Typography variant="h6">Showing {contacts.length} Products</Typography>

        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
          onClick={() => setModal(true)}
        >
          + Add New Contact Lens
        </Button>
      </Grid>

      <Grid container spacing={2} justifyContent="center" sx={{ padding: 2 }}>
        {contacts.map((lens) => (
          <Grid item key={lens.contactID} minWidth={100}>
            <Card>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="140"
                  image={lens.img}
                  alt="Contact Lens"
                />
                <CardContent>
                  <Grid container justifyContent="space-between">
                    <Grid item>
                      <Typography variant="h5">{lens.name}</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h5" fontWeight="bold">
                        ${parseFloat(lens.price).toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
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
    </div>
  );
};

export default AdminContacts;
