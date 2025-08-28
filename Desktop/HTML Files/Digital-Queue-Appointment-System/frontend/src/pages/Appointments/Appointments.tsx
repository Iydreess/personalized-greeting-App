import React from 'react';
import { Typography, Box } from '@mui/material';

const Appointments: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Appointments
      </Typography>
      <Typography>
        This page will show user appointments with booking, rescheduling, and cancellation features.
      </Typography>
    </Box>
  );
};

export default Appointments;
