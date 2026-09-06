import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const AppAutocomplete = ({
  options = [],
  value = null,
  onChange,
  getOptionLabel = (option) => option?.label || option?.name || '',
  isOptionEqualToValue = (option, val) => option?.id === val?.id,
  label = 'Select Option',
  placeholder = 'Search or select...',
  error,
  helperText,
  required = false,
  fullWidth = true,
  renderCustomOption,
  ...props
}) => {
  return (
    <Autocomplete
      options={options}
      value={value}
      onChange={(event, newValue) => {
        onChange(newValue);
      }}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      fullWidth={fullWidth}
      autoHighlight
      renderOption={(props, option) => {
        const { key, ...restProps } = props;
        return (
          <Box component="li" key={key || option.id} {...restProps}>
            {renderCustomOption ? (
              renderCustomOption(option)
            ) : (
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {option.name || option.label}
                </Typography>
                {option.secondary && (
                  <Typography variant="caption" color="text.secondary">
                    {option.secondary}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          required={required}
          error={Boolean(error)}
          helperText={error || helperText}
          variant="outlined"
        />
      )}
      {...props}
    />
  );
};

export default AppAutocomplete;
