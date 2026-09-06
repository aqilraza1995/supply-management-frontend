import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useSnackbar } from '../../hooks/useSnackbar';

export const AppSnackbar = () => {
  const { snackbar, close } = useSnackbar();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    close();
  };

  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={handleClose}
        severity={snackbar.severity || 'success'}
        variant="filled"
        elevation={6}
        sx={{
          width: '100%',
          fontWeight: 600,
          borderRadius: 2,
          boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
        }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
};

export default AppSnackbar;
