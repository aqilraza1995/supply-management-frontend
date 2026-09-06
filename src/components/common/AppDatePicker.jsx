import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export const AppDatePicker = ({
  label = 'Select Date',
  value,
  onChange,
  error,
  helperText,
  required = false,
  fullWidth = true,
  max,
  min,
  ...props
}) => {
  return (
    <TextField
      type="date"
      label={label}
      value={value || ''}
      onChange={onChange}
      required={required}
      fullWidth={fullWidth}
      error={Boolean(error)}
      helperText={error || helperText}
      variant="outlined"
      slotProps={{
        inputLabel: {
          shrink: true,
        },
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <CalendarMonthIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          ),
        },
        htmlInput: {
          max,
          min,
        },
      }}
      {...props}
    />
  );
};

export default AppDatePicker;
