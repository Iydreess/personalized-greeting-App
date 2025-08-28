import React from 'react';
import { Typography, Box } from '@mui/material';

const Dashboard: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography>
        This page will show admin dashboard with analytics and overview metrics.
      </Typography>
    </Box>
  );
};

export default Dashboard;
