import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import ProfileDropdown from "./profileDropdown";
import useCartStore from "../components/cartStorage";
import './navBar.css';

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { cart } = useCartStore();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
    <Box
        sx={{
          backgroundColor: "black",
          height: "70px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img src={"/images/logo"} alt="logo" style={{ height: "150px" }} />
      </Box>
      <Box className="navbar">
        <Box className="nav-links">
        <Typography className="divider">|</Typography>
          <Button component={Link} to="/home" className="nav-button">Home</Button>
          <Typography className="divider">|</Typography>
          <Button component={Link} to="/log-in" className="nav-button">Patient's Center</Button>
          <Typography className="divider">|</Typography>
          <Button component={Link} to="/services" className="nav-button">Services</Button>
          <Typography className="divider">|</Typography>
          <Button component={Link} to="/frames" className="nav-button">Contacts & Frames</Button>
          <Typography className="divider">|</Typography>
          <Button component={Link} to="/about" className="nav-button">About</Button>
          <Typography className="divider">|</Typography>
      
        </Box>

        <Box className="nav-right">
          <ProfileDropdown />
        </Box>
      </Box>
    </>
  );
};

export default NavBar;
