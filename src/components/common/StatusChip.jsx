import React from 'react';
import Chip from '@mui/material/Chip';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export const StatusChip = ({ status, label, size = 'small', sx }) => {
  const normalizedStatus = String(status || '').toUpperCase();

  let color = 'default';
  let icon = null;
  let displayLabel = label || status;

  switch (normalizedStatus) {
    case 'PAID':
    case 'CLEARED':
    case 'SETTLED':
      color = 'success';
      icon = <CheckCircleIcon sx={{ fontSize: '14px !important' }} />;
      displayLabel = displayLabel || 'Paid';
      break;
    case 'PARTIAL':
    case 'PARTIALLY PAID':
      color = 'warning';
      icon = <WarningAmberIcon sx={{ fontSize: '14px !important' }} />;
      displayLabel = displayLabel || 'Partial';
      break;
    case 'UNPAID':
    case 'PENDING':
    case 'OUTSTANDING':
      color = 'error';
      icon = <ErrorOutlinedIcon sx={{ fontSize: '14px !important' }} />;
      displayLabel = displayLabel || 'Unpaid';
      break;
    case 'ACTIVE':
      color = 'info';
      icon = <InfoOutlinedIcon sx={{ fontSize: '14px !important' }} />;
      displayLabel = displayLabel || 'Active';
      break;
    default:
      color = 'default';
  }

  return (
    <Chip
      label={displayLabel}
      color={color}
      size={size}
      icon={icon}
      sx={{
        fontWeight: 600,
        height: 24,
        px: 0.5,
        ...sx,
      }}
    />
  );
};

export default StatusChip;
