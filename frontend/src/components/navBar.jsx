import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Badge, IconButton } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ProfileDropdown from "./profileDropdown";
import useCartStore from "../components/cartStorage";
import './navBar.css';

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { cart } = useCartStore();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const navigate = useNavigate();
  const role = localStorage.getItem("userRole");

  const getPortalLink = () => {
    const role = localStorage.getItem("userRole");
    const id = localStorage.getItem("userID");
    const doctorID = localStorage.getItem("doctorID");

    if (!role || !id) return "/log-in";

    switch (role.toLowerCase()) {
      case "admin":
        return `/adminProfile/${id}`;
      case "doctor":
        return `/doctorProfile/${doctorID}`;
      case "receptionist":
        return `/employeeProfile/${id}`;
      case "nurse":
        return `/nurseProfile/${id}`;
      case "patient":
        return `/userProfile/${id}`;
      default:
        return "/log-in";
    }
  };
  const handleCartClick = () => {
    if (role === "Receptionist" || role === "employee") {
      navigate("/checkout");
    } else if (role === "patient") {
      navigate("/userCheckout");
    } else {
      alert("Cart access denied for this role.");
    }
  };
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
      <Box className="navbar">
        <Box className="nav-links">
        <Typography className="divider">|</Typography>
          <Button component={Link} to="/home" className="nav-button">Home</Button>
          <Typography className="divider">|</Typography>
          <Button component={Link} to="/log-in" className="nav-button">Log-In Portal</Button>
          <Typography className="divider">|</Typography>
          <Button component={Link} to={"/book-appointment"} className="nav-button">Book Appointment</Button>
          <Typography className="divider">|</Typography>
          <Button component={Link} to="/services" className="nav-button">Services</Button>
          <Typography className="divider">|</Typography>
          <Button component={Link} to="/frames" className="nav-button">Contacts & Frames</Button>
          <Typography className="divider">|</Typography>
          <Button component={Link} to="/about" className="nav-button">About</Button>
          <Typography className="divider">|</Typography>
        </Box>

        <Box className="nav-right">
        <IconButton onClick={handleCartClick}>
  <Badge badgeContent={totalItems} color="secondary">
    <ShoppingCartIcon />
  </Badge>
</IconButton>


          <ProfileDropdown />
        </Box>
      </Box>
    </>
  );
};

export default NavBar;




