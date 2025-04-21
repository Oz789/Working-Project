import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
  TableContainer,
  Box,
  Button,
  Alert,
} from "@mui/material";
import RestockFormModal from "./restockModal";

const StockMonitor = ({ onStockStatusChange }) => {
  const { employeeID } = useParams();

  const [inventory, setInventory] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [mostPurchased, setMostPurchased] = useState(null);
  const [restockModalItem, setRestockModalItem] = useState(null);
  const LOW_STOCK_THRESHOLD = 5;
  const RESTOCK_AMOUNT = 10;

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/inventory");
      const filtered = res.data.filter(
        (item) => item.type === "frame" || item.type === "contact"
      );
      const sorted = filtered.sort((a, b) => a.stockCount - b.stockCount);
      setInventory(sorted);

      const lowStockExists = sorted.some((item) => item.stockCount < LOW_STOCK_THRESHOLD);
      if (onStockStatusChange) {
        onStockStatusChange(lowStockExists);
      }

      fetchSalesData(sorted);
    } catch (err) {
      console.error("Error fetching inventory:", err);
      setError("Failed to fetch inventory.");
    }
  };

  const fetchSalesData = async (items) => {
    try {
      const allSales = [];

      for (let item of items) {
        const res = await axios.get(
          `http://localhost:5001/api/sales/item/${item.id}/${item.type}`
        );
        const salesWithDetails = res.data.map((sale) => ({
          ...sale,
          itemDetails: item,
        }));
        allSales.push(...salesWithDetails);
      }

      const summaryMap = {};
      allSales.forEach((sale) => {
        const key = `${sale.itemDetails.id}-${sale.itemDetails.type}`;
        if (!summaryMap[key]) {
          summaryMap[key] = { item: sale.itemDetails, quantity: 0 };
        }
        summaryMap[key].quantity += parseInt(sale.quantity, 10);
      });

      const summaryArray = Object.values(summaryMap);
      const mostPurchasedItem = summaryArray.reduce(
        (max, item) => (item.quantity > max.quantity ? item : max),
        { quantity: 0 }
      );

      setMostPurchased(mostPurchasedItem);
    } catch (err) {
      console.error("Error fetching sales data:", err);
    }
  };

  const handleRestockSuccess = () => {
    setMessage("Item restocked successfully.");
    setError("");
    fetchInventory();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Inventory Stock Monitor
      </Typography>

      {mostPurchased?.item && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">Most Purchased Frame/Contact</Typography>
          <Typography>
            {`${mostPurchased.item.type.charAt(0).toUpperCase() +
              mostPurchased.item.type.slice(1)} - ${mostPurchased.item.brand} - ${
              mostPurchased.item.name
            } - ${mostPurchased.item.model} (${mostPurchased.quantity} sold)`}
          </Typography>
          <Typography sx={{ mt: 1, fontStyle: "italic", color: "#555" }}>
            We recommend restocking this item with {RESTOCK_AMOUNT * 2} units.
          </Typography>
          <Button
            variant="outlined"
            size="small"
            sx={{ mt: 1 }}
            onClick={() =>
              setRestockModalItem({
                ...mostPurchased.item,
                suggestedQty: RESTOCK_AMOUNT * 2,
              })
            }
          >
            Restock Suggested Amount
          </Button>
        </Box>
      )}

      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#b3e5fc" }}>
              <TableCell>Type</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventory.map((item) => {
              const isLowStock = item.stockCount < LOW_STOCK_THRESHOLD;

              return (
                <TableRow
                  key={`${item.id}-${item.type}`}
                  sx={{ backgroundColor: isLowStock ? "#ffcccc" : "white" }}
                >
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.brand}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.model}</TableCell>
                  <TableCell>{item.stockCount}</TableCell>
                  <TableCell>
                    {isLowStock && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => setRestockModalItem(item)}
                      >
                        Restock
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {restockModalItem && (
        <RestockFormModal
          item={restockModalItem}
          onClose={() => setRestockModalItem(null)}
          onSuccess={handleRestockSuccess}
        />
      )}
    </Box>
  );
};

export default StockMonitor;
