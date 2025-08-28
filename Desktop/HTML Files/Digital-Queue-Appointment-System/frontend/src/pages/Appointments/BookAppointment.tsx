import React from 'react';
import { Typography, Box } from '@mui/material';

const BookAppointment: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Book Appointment
      </Typography>
      <Typography>
        This page will allow users to book new appointments with date/time selection.
      </Typography>
    </Box>
  );
};

export default BookAppointment;
