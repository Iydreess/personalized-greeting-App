import React from 'react';
import { Typography, Box } from '@mui/material';

const QueueManagement: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Queue Management
      </Typography>
      <Typography>
        This page will allow staff to manage queues, call customers, and update statuses.
      </Typography>
    </Box>
  );
};

export default QueueManagement;
