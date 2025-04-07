import React from "react";
import { Grid, Box, Button } from "@mui/material";

const ReportColumn = ({ label, borderRight }) => (
  <Box
    sx={{
      height: "calc(90vh - 40px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRight: borderRight ? "2px solid black" : "none",
    }}
  >
    <Button
      variant="contained"
      sx={{
        fontSize: "1.2rem",
        fontFamily: "BellMT",
        padding: "12px 24px",
        fontWeight: "bold",
        textTransform: "italic",
        backgroundColor: "white",
        color: "black",
        boxShadow: "none",
        "&:hover": {
          backgroundColor: "#f5f5f5",
        },
      }}
    >
      {label}
    </Button>
  </Box>
);

const AdminReports = () => {
  return (
    <Grid container>
      <Grid item xs={12} md={4}>
        <ReportColumn label="Staff" borderRight />
      </Grid>
      <Grid item xs={12} md={4}>
        <ReportColumn label="Patients" borderRight />
      </Grid>
      <Grid item xs={12} md={4}>
        <ReportColumn label="Inventory" />
      </Grid>
    </Grid>
  );
};

export default AdminReports;

