import React from 'react';
import TextField from '@mui/material/TextField';

export const AppTextField = ({
  label,
  value,
  onChange,
  error,
  helperText,
  required = false,
  fullWidth = true,
  size = 'medium',
  ...props
}) => {
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      error={Boolean(error)}
      helperText={error || helperText}
      required={required}
      fullWidth={fullWidth}
      size={size}
      variant="outlined"
      {...props}
    />
  );
};

export default AppTextField;
