import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Grid,
  Card,
  CardContent
} from "@mui/material";
import axios from "axios";

const InventoryReport = () => {
  const [inventory, setInventory] = useState([]);
  const [type, setType] = useState("");
  const [brand, setBrand] = useState("");
  const [priceRange, setPriceRange] = useState([0, 300]);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/inventory");
      setInventory(res.data);
    } catch (err) {
      console.error("Error fetching inventory:", err);
    }
  };

  const filtered = inventory.filter((item) => {
    const inType = type ? item.itemType === type : true;
    const inBrand = brand ? item.brand === brand : true;
    const inPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
    return inType && inBrand && inPrice;
  });

  const uniqueBrands = [...new Set(inventory.map((item) => item.brand))];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Inventory Report
      </Typography>
      <Grid container spacing={2} marginBottom={3}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select value={type} onChange={(e) => setType(e.target.value)} label="Type">
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Frame">Frame</MenuItem>
              <MenuItem value="Contact">Contact</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Brand</InputLabel>
            <Select value={brand} onChange={(e) => setBrand(e.target.value)} label="Brand">
              <MenuItem value="">All</MenuItem>
              {uniqueBrands.map((b) => (
                <MenuItem key={b} value={b}>{b}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Typography gutterBottom>Price Range (${priceRange[0]} - ${priceRange[1]})</Typography>
          <Slider
            value={priceRange}
            onChange={(e, newVal) => setPriceRange(newVal)}
            valueLabelDisplay="auto"
            min={0}
            max={300}
          />
        </Grid>
      </Grid>




      <Grid container spacing={2}>
        {filtered.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.itemID}>
            <Card>
            <CardContent>
  <Typography variant="h6">{item.itemType === 'Frame' ? item.frameName : item.contactName}</Typography>
  <Typography>Brand: {item.brand}</Typography>
  <Typography>Type: {item.itemType}</Typography>
  <Typography>Model: {item.itemType === 'Frame' ? item.frameModel : item.contactModel}</Typography>
  {item.itemType === 'Frame' && <Typography>Material: {item.frameMaterial}</Typography>}
  {item.itemType === 'Contact' && <Typography>Vision: {item.visionType}</Typography>}
  <Typography>Price: ${item.price.toFixed(2)}</Typography>
  <Typography>In Stock: {item.stockCount}</Typography>
</CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
            <Box mt={4}>
        <Typography variant="h6">
          Total Items Displayed: {filtered.length}
        </Typography>
                <Typography variant="h6">
          Total Stock Count: {filtered.reduce((acc, cur) => acc + cur.stockCount, 0)}
        </Typography>
      </Box>
    </Box>
  );
};

export default InventoryReport;
