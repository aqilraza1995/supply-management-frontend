import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

export const AppLoader = ({ message = 'Loading...', minHeight = 240 }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight,
        p: 4,
      }}
    >
      <CircularProgress size={36} thickness={4} />
      {message && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontWeight: 500 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default AppLoader;
