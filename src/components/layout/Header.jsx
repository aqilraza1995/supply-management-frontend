import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// MUI Components
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Button,
  Tooltip,
  Chip,
  IconButton,
} from "@mui/material";

// Icons
import { Logout, AddCircleOutlined, Payments } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";

// Custom Components
import AppIconButton from "../common/AppIconButton";
import { useAuth } from "../../hooks/useAuth";
import { useSnackbar } from "../../hooks/useSnackbar";
import { ROUTES } from "../../constants/appConstants";

export const Header = ({ onDrawerToggle }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { notifyInfo } = useSnackbar();

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    notifyInfo("Successfully signed out");
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "#FFFFFF",
        color: "#0F172A",
        borderBottom: "1px solid #E2E8F0",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, sm: 3 } }}>
        {/* Left Side: Mobile Menu Toggle & Brand */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AppIconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onDrawerToggle}
            sx={{ display: { md: "none" }, mr: 1 }}
            icon={<MenuIcon />}
          />

          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: "text.secondary" }}
            >
              Enterprise Supplier & FIFO Ledger
            </Typography>
          </Box>
        </Box>

        {/* Right Side: Quick Actions & Profile */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, sm: 1.5 },
          }}
        >
          {/* Quick Add Supply CTA */}
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddCircleOutlined fontSize="small" />}
            onClick={() => navigate(ROUTES.SUPPLIES_ADD)}
            sx={{
              display: { xs: "none", sm: "inline-flex" },
              borderColor: "#CBD5E1",
              color: "#334155",
              "&:hover": {
                borderColor: "primary.main",
                bgcolor: "rgba(37, 99, 235, 0.04)",
              },
            }}
          >
            New Supply
          </Button>

          {/* Quick Add Payment CTA */}
          <Button
            variant="contained"
            color="secondary"
            size="small"
            startIcon={<Payments fontSize="small" />}
            onClick={() => navigate(ROUTES.PAYMENTS_ADD)}
            sx={{
              display: { xs: "none", sm: "inline-flex" },
            }}
          >
            Receive Payment
          </Button>

          {/* User Profile Avatar & Menu */}
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleProfileMenuOpen}
              size="small"
              sx={{ ml: 1, p: 0.5, border: "2px solid #E2E8F0" }}
              aria-controls={openMenu ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openMenu ? "true" : undefined}
            >
              <Avatar
                sx={{
                  width: 34,
                  height: 34,
                  bgcolor: "primary.main",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={openMenu}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            PaperProps={{
              elevation: 4,
              sx: {
                minWidth: 220,
                borderRadius: 2,
                mt: 1.5,
                p: 0.5,
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, color: "#0F172A" }}
              >
                {user?.name || "Administrator"}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", display: "block", mb: 1 }}
              >
                {user?.email || "admin@example.com"}
              </Typography>
              <Chip
                label={user?.role || "Administrator"}
                size="small"
                color="primary"
                sx={{ height: 20, fontSize: "0.6875rem", fontWeight: 600 }}
              />
            </Box>

            <Divider />

            <MenuItem
              onClick={handleLogout}
              sx={{ color: "error.main", py: 1.2 }}
            >
              <ListItemIcon sx={{ color: "error.main", minWidth: 32 }}>
                <Logout fontSize="small" />
              </ListItemIcon>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Sign Out
              </Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
