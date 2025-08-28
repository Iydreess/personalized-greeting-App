import React from 'react';
import { Typography, Box } from '@mui/material';

const JoinQueue: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Join Queue
      </Typography>
      <Typography>
        This page will allow users to join virtual queues for walk-in services.
      </Typography>
    </Box>
  );
};

export default JoinQueue;
