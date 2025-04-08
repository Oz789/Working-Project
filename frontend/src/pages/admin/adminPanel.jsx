import React from "react";
import { Grid, Typography, Box, Link } from "@mui/material";

const adminLinks = [
  { label: "Manage Staff", href: "/admin/manageStaff" },
  { label: "Manage Frames", href: "/admin/admin-frames" },
  { label: "Manage Eye Contacts", href: "/admin/admin-eyeContacts" },
  { label: "Manage Clinic Services", href: "/admin/admin-Services" },
  { label: "View Reports", href: "/admin/reports" },
];

const AdminControlPanel = () => {
  return (
    <Box sx={{ px: 4, pt: 1, pb: 0 }}>
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", mb: 1 }}
      >
      </Typography>

      <Grid container spacing={2}>
        {adminLinks.map((item, idx) => (
          <Grid item xs={6} sm={4} md={2.4} key={idx}>
            <Box sx={{ textAlign: "center" }}>
              <Link
                href={item.href}
                underline="hover"
                variant="body2"
                sx={{ fontWeight: 500 }}
              >
                {item.label}
              </Link>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminControlPanel;


