import React from 'react';
import Box from '@mui/material/Box';

export const ResponsiveTable = ({ children, sx }) => {
  return (
    <Box
      sx={{
        width: '100%',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        '&::-webkit-scrollbar': {
          height: 6,
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#CBD5E1',
          borderRadius: 3,
        },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default ResponsiveTable;
