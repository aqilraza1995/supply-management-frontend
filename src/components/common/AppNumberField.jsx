import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

export const AppNumberField = ({
  label,
  value,
  onChange,
  error,
  helperText,
  prefix,
  suffix,
  min = 0,
  max,
  step = 'any',
  required = false,
  fullWidth = true,
  ...props
}) => {
  const handleChange = (e) => {
    const val = e.target.value;
    // Allow empty string for clearing or valid numeric characters
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      onChange(e);
    }
  };

  return (
    <TextField
      label={label}
      value={value}
      onChange={handleChange}
      error={Boolean(error)}
      helperText={error || helperText}
      type="text"
      inputMode="decimal"
      required={required}
      fullWidth={fullWidth}
      variant="outlined"
      slotProps={{
        input: {
          startAdornment: prefix ? (
            <InputAdornment position="start">{prefix}</InputAdornment>
          ) : null,
          endAdornment: suffix ? (
            <InputAdornment position="end">{suffix}</InputAdornment>
          ) : null,
        },
        htmlInput: {
          min,
          max,
          step,
        },
      }}
      {...props}
    />
  );
};

export default AppNumberField;
