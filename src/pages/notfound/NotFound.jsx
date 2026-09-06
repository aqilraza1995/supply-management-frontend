import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';
import { ROUTES } from '../../constants/appConstants';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: 3,
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          bgcolor: 'rgba(220, 38, 38, 0.1)',
          color: 'error.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2.5,
        }}
      >
        <ErrorOutlinedIcon sx={{ fontSize: 44 }} />
      </Box>

      <Typography variant="h3" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
        404 - Page Not Found
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 450, mb: 3.5 }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        size="large"
        startIcon={<DashboardIcon />}
        onClick={() => navigate(ROUTES.DASHBOARD)}
      >
        Back to Dashboard
      </Button>
    </Box>
  );
};

export default NotFound;
