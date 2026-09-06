import React from 'react';
import Drawer from '@mui/material/Drawer';
import Sidebar from './Sidebar';

export const MobileDrawer = ({ open, onClose, drawerWidth = 260 }) => {
  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Better mobile performance
      }}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: drawerWidth,
          bgcolor: '#0F172A',
          borderRight: 'none',
        },
      }}
    >
      <Sidebar onNavigate={onClose} />
    </Drawer>
  );
};

export default MobileDrawer;
