import React, { useState } from "react";

// MUI Components
import { TextField, InputAdornment } from "@mui/material";

// icons
import { Visibility, VisibilityOff } from "@mui/icons-material";

// Custom Components
import AppIconButton from "./AppIconButton";

export const AppTextField = ({
  type = "text",
  startIcon,
  value,
  onChange,
  error,
  helperText,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const isNumber = type === "number";

  const handleNumberKeyPress = (e) => {
    if (!isNumber) return;
    // Block e, E, -, +
    if (["e", "E", "-", "+"].includes(e.key)) {
      e.preventDefault();
    }
    // Block second dot
    if (e.key === "." && e.currentTarget.value.includes(".")) {
      e.preventDefault();
    }
  };

  return (
    <TextField
      {...props}
      label={props.label}
      value={value}
      onChange={onChange}
      type={isPassword ? (showPassword ? "text" : "password") : type}
      error={Boolean(error)}
      helperText={error || helperText}
      required={props.required}
      fullWidth={props.fullWidth ?? true}
      size={props.size ?? "medium"}
      variant="outlined"
      onKeyPress={handleNumberKeyPress}
      slotProps={{
        input: {
          startAdornment: startIcon ? (
            <InputAdornment position="start"> {startIcon} </InputAdornment>
          ) : undefined,
          endAdornment: isPassword ? (
            <InputAdornment position="end">
              <AppIconButton
                edge="end"
                onClick={() => setShowPassword((prev) => !prev)}
                icon={
                  showPassword ? (
                    <VisibilityOff fontSize="small" />
                  ) : (
                    <Visibility fontSize="small" />
                  )
                }
              />
            </InputAdornment>
          ) : undefined,
        },
      }}
    />
  );
};
export default AppTextField;
