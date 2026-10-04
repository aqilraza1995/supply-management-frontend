import { IconButton } from "@mui/material";

const AppIconButton = ({
  size = "small",
  color = "secondary",
  onClick,
  icon,
  ...rest
}) => {
  return (
    <IconButton size={size} color={color} onClick={onClick} {...rest}>
      {icon}
    </IconButton>
  );
};

export default AppIconButton;
