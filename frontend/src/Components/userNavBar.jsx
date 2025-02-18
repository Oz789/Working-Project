import React from "react";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const UserNavbar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar sx={{ backgroundColor: "#000000", height:"200px"}} position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", Height: "200px" }}>
          {}
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
            Eye Clinic
          </Typography>

          
          <Box>
            <Button color="inherit" component={Link} to="/about">
              About
            </Button>
            <Button color="inherit" component={Link} to="/contact">
              Contact Us
            </Button>
            <Button color="inherit" component={Link} to="/book-appointment">
              Book Appointment
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default UserNavbar;