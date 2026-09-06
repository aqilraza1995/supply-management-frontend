import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FolderOffOutlinedIcon from '@mui/icons-material/FolderOffOutlined';
import AppButton from './AppButton';

export const EmptyState = ({
  icon: CustomIcon,
  title = 'No records found',
  description = 'There are no items matching your criteria or no data added yet.',
  actionLabel,
  onAction,
  actionIcon,
  sx,
}) => {
  const IconComponent = CustomIcon || FolderOffOutlinedIcon;

  return (
    <Box
      sx={{
        py: 8,
        px: 3,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        ...sx,
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          bgcolor: '#F1F5F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
          color: '#64748B',
        }}
      >
        <IconComponent sx={{ fontSize: 32 }} />
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: '#1E293B' }}>
        {title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ maxWidth: 420, mb: actionLabel ? 2.5 : 0 }}
      >
        {description}
      </Typography>
      {actionLabel && onAction && (
        <AppButton
          onClick={onAction}
          startIcon={actionIcon}
          variant="contained"
          color="primary"
          size="small"
        >
          {actionLabel}
        </AppButton>
      )}
    </Box>
  );
};

export default EmptyState;
