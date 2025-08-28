import React from 'react';
import { Typography, Box } from '@mui/material';

const Profile: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>
      <Typography>
        This page will allow users to view and edit their profile information.
      </Typography>
    </Box>
  );
};

export default Profile;
