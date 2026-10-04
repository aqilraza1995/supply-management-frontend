import React from 'react';

//MUI Compnents
import {TextField, InputAdornment} from "@mui/material";

//icons
import {Search,Clear} from "@mui/icons-material";

// Custom Components
import AppIconButton from './AppIconButton';

export const AppSearch = ({
  value = '',
  onChange,
  onClear,
  placeholder = 'Search by name or keyword...',
  size = 'small',
  sx,
  fullWidth = true,
}) => {
  return (
    <TextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      size={size}
      fullWidth={fullWidth}
      variant="outlined"
      sx={{ maxWidth: fullWidth ? '100%' : { xs: '100%', sm: 340 }, ...sx }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Search fontSize="small" sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position="end">
              <AppIconButton
                onClick={() => {
                  if (onClear) onClear();
                  else onChange('');
                }}
                edge="end"
                aria-label="clear search"
                icon={<Clear fontSize="small" />}
              />
            </InputAdornment>
          ) : null,
        },
      }}
    />
  );
};

export default AppSearch;
