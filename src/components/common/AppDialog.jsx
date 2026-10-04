import React from 'react';

// MUI Components
import {Dialog, DialogTitle, DialogContent, DialogActions, Typography} from "@mui/material"
// import Dialog from '@mui/material/Dialog';
// import DialogTitle from '@mui/material/DialogTitle';
// import DialogContent from '@mui/material/DialogContent';
// import DialogActions from '@mui/material/DialogActions';
// import IconButton from '@mui/material/IconButton';

//Icons
import {Close } from "@mui/icons-material"
// // import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';

import AppIconButton from './AppIconButton';

export const AppDialog = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: { borderRadius: 3, p: 1 },
      }}
    >
      {title && (
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          {onClose && (
            <AppIconButton
              aria-label="close"
              onClick={onClose}
              sx={{ color: (theme) => theme.palette.grey[500] }}
              icon={<Close fontSize="small" />}
            />
          )}
        </DialogTitle>
      )}
      <DialogContent dividers sx={{ p: 3 }}>
        {children}
      </DialogContent>
      {actions && <DialogActions sx={{ p: 2 }}>{actions}</DialogActions>}
    </Dialog>
  );
};

export default AppDialog;
