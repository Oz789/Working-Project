import React from "react";
import { Tabs, Tab, Box, Badge } from "@mui/material";

const tabLabels = ["Profile", "Register", "Appointments", "Inbox", "Stock"];

const EmpTabs = ({ activeTab, setActiveTab, lowStockAlert }) => {
  const handleChange = (e, newVal) => setActiveTab(newVal);

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Tabs value={activeTab} onChange={handleChange}>
        {tabLabels.map((label, idx) => {
          const showBadge = label === "Stock" && lowStockAlert;

          return (
            <Tab
              key={idx}
              label={
                showBadge ? (
                  <Badge color="error" variant="dot">
                    {label}
                  </Badge>
                ) : (
                  label
                )
              }
            />
          );
        })}
      </Tabs>
    </Box>
  );
};

export default EmpTabs;
