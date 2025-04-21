import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Badge, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ProfileDropdown from "./profileDropdown";
import useCartStore from "../components/cartStorage";

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
          position: "sticky",
          top: 0,
          backgroundColor: "white",
          zIndex: 1000,
          borderBottom: "1px solid #dcdcdc",
          height: "65px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "30px",
            fontFamily: "'Bell MT'",
            fontWeight: "bold",
          }}
        > <Typography>|</Typography>
          <Button component={Link} to="/home" sx={{ color: "#3E2723" }}>
            Home
          </Button>
          <Typography>|</Typography>
          <Button component={Link} to="/log-in" sx={{ color: "#3E2723" }}>
            Log-In Portal
          </Button>
          <Typography>|</Typography>
          <Button component={Link} to="/services" sx={{ color: "#3E2723" }}>
            Services
          </Button>
          <Typography>|</Typography>
          <Button component={Link} to="/frames" sx={{ color: "#3E2723" }}>
            Contacts & Frames
          </Button>
          <Typography>|</Typography>
          <Button component={Link} to="/about" sx={{ color: "#3E2723" }}>
            About
          </Button>
          <Typography>|</Typography>
          
        </Box>

    
        <Box sx={{ display: "flex", alignItems: "center", gap: "1rem", position: "absolute", right: "1rem" }}>
          <IconButton component={Link} to="/Checkout" color="inherit">
            <Badge badgeContent={totalItems} color="error">
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