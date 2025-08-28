import React from 'react';
import { Typography, Box } from '@mui/material';

const Queue: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Queue Status
      </Typography>
      <Typography>
        This page will show real-time queue status and allow users to track their position.
      </Typography>
    </Box>
  );
};

export default Queue;
