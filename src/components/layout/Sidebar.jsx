import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import PaymentsIcon from '@mui/icons-material/Payments';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import HubIcon from '@mui/icons-material/Hub';
// import CompanyIcon from '@mui/icons-material/Store'
// import AddCompany from '@mui/icons-material/AddBusiness'
import {Store, AddBusiness, Dashboard, LocalShipping, Inventory, Receipt, Paid, Payment, AddCard} from '@mui/icons-material'

import { ROUTES, APP_NAME } from '../../constants/appConstants';

export const Sidebar = ({ onNavigate }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Collapsible groups
  const isSuppliersActive = location.pathname.startsWith('/suppliers');
  const isSuppliesActive = location.pathname.startsWith('/supplies');
  const isPaymentsActive = location.pathname.startsWith('/payments');
  const isThirdPartyPaymentsActive = location.pathname.startsWith('/third-party-payments');
  const isAdvancePaymentActive = location.pathname.startsWith('/advance-payments');

  const [openSuppliers, setOpenSuppliers] = useState(true);
  const [openSupplies, setOpenSupplies] = useState(true);
  const [openPayments, setOpenPayments] = useState(true);
  const [openThirdPayments, setOpenThirdPayments] = useState(true);
  const [openAdvancePayment, setOpenAdvancePayment] = useState(true);

  const handleNav = (path) => {
    navigate(path);
    if (onNavigate) {
      onNavigate();
    }
  };

  const isActive = (path) => {
    if (path === ROUTES.DASHBOARD) {
      return location.pathname === ROUTES.DASHBOARD;
    }
    return location.pathname === path;
  };

  const menuSections = [
    {
      title: 'Main',
      items: [
        {
          label: 'Dashboard',
          icon: <Dashboard fontSize="small" />,
          path: ROUTES.DASHBOARD,
          active: isActive(ROUTES.DASHBOARD),
        },
      ],
    },
    {
      title: 'Compinies',
      open: openSuppliers,
      setOpen: setOpenSuppliers,
      active: isSuppliersActive,
      icon: <Store fontSize="small" />,
      subItems: [
        {
          label: 'Company List',
          icon: <FormatListBulletedIcon fontSize="small" />,
          path: ROUTES.SUPPLIERS,
          active: location.pathname === ROUTES.SUPPLIERS,
        },
        {
          label: 'Add Company',
          icon: <AddBusiness fontSize="small" />,
          path: ROUTES.SUPPLIERS_ADD,
          active: location.pathname === ROUTES.SUPPLIERS_ADD,
        },
      ],
    },
    {
      title: 'Supply',
      open: openSupplies,
      setOpen: setOpenSupplies,
      active: isSuppliesActive,
      icon: <LocalShipping fontSize="small" />,
      subItems: [
        {
          label: 'Supply List',
          icon: <FormatListBulletedIcon fontSize="small" />,
          path: ROUTES.SUPPLIES,
          active: location.pathname === ROUTES.SUPPLIES,
        },
        {
          label: 'Add Supply',
          // icon: <AddCircleOutlinedIcon fontSize="small" />,
          icon: <Inventory fontSize="small" />,
          path: ROUTES.SUPPLIES_ADD,
          active: location.pathname === ROUTES.SUPPLIES_ADD,
        },
      ],
    },
    {
      title: 'Receive Payment',
      open: openPayments,
      setOpen: setOpenPayments,
      active: isPaymentsActive,
      // icon: <PaymentsIcon fontSize="small" />,
      icon: <Receipt fontSize="small" />,
      subItems: [
        {
          label: 'Payment List',
          // icon: <ReceiptLongIcon fontSize="small" />,
          icon: <FormatListBulletedIcon fontSize="small" />,
          path: ROUTES.PAYMENTS,
          active: location.pathname === ROUTES.PAYMENTS,
        },
        {
          label: 'Add Payment',
          icon: <AddCircleOutlinedIcon fontSize="small" />,
          path: ROUTES.PAYMENTS_ADD,
          active: location.pathname === ROUTES.PAYMENTS_ADD,
        },
      ],
    },
    {
      title: 'Third Party Payment',
      open: openThirdPayments,
      setOpen: setOpenThirdPayments,
      active: isThirdPartyPaymentsActive,
      icon: <Paid fontSize="small" />,
      subItems: [
        {
          label: 'Third Party Payment List',
          icon: <FormatListBulletedIcon fontSize="small" />,
          path: ROUTES.PAYMENTS,
          active: location.pathname === ROUTES.PAYMENTS,
        },
        {
          label: 'Add Third Party Payment',
          icon: <ReceiptLongIcon fontSize="small" />,
          path: ROUTES.PAYMENTS_ADD,
          active: location.pathname === ROUTES.PAYMENTS_ADD,
        },
      ],
    },
    {
      title: 'Advance Payment',
      open: openAdvancePayment,
      setOpen: setOpenAdvancePayment,
      active: isAdvancePaymentActive,
      icon: <Payment fontSize="small" />,
      subItems: [
        {
          label: 'Advance Payment List',
          icon: <FormatListBulletedIcon fontSize="small" />,
          path: ROUTES.PAYMENTS,
          active: location.pathname === ROUTES.PAYMENTS,
        },
        {
          label: 'Add Advance Payment',
          icon: <AddCard fontSize="small" />,
          path: ROUTES.PAYMENTS_ADD,
          active: location.pathname === ROUTES.PAYMENTS_ADD,
        },
      ],
    },
  ];

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#0F172A', // Deep slate navy
        color: '#F8FAFC',
      }}
    >
      {/* Brand Header */}
      <Box
        sx={{
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: 2,
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
          }}
        >
          <HubIcon sx={{ color: '#FFFFFF', fontSize: 22 }} />
        </Box>
        <Box sx={{ overflow: 'hidden' }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
            }}
          >
            Balraj Fisheries
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: '#94A3B8',
              fontSize: '0.6875rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            FIFO Settlement
          </Typography>
        </Box>
      </Box>

      {/* Navigation List */}
      <Box sx={{ flex: 1, py: 2, px: 1.5, overflowY: 'auto' }}>
        {/* Dashboard Link */}
        <List disablePadding sx={{ mb: 1.5 }}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNav(ROUTES.DASHBOARD)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                px: 2,
                py: 1.2,
                bgcolor: isActive(ROUTES.DASHBOARD) ? 'primary.main' : 'transparent',
                // color: isActive(ROUTES.DASHBOARD) ? '#FFFFFF' : '#94A3B8',
                color: '#FFFFFF',
                '&:hover': {
                  bgcolor: isActive(ROUTES.DASHBOARD) ? 'primary.dark' : 'rgba(255, 255, 255, 0.05)',
                  color: '#FFFFFF',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 36,
                  color: isActive(ROUTES.DASHBOARD) ? '#FFFFFF' : '#94A3B8',
                }}
              >
                <Dashboard fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Dashboard"
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: isActive(ROUTES.DASHBOARD) ? 700 : 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.06)', mb: 2 }} />

        {/* Modular Groups */}
        {menuSections.slice(1).map((section) => (
          <Box key={section.title} sx={{ mb: 1.5 }}>
            <ListItemButton
              onClick={() => section.setOpen(!section.open)}
              sx={{
                borderRadius: 2,
                px: 2,
                py: 1,
                color: section.active ? '#FFFFFF' : '#CBD5E1',
                bgcolor: section.active && !section.open ? 'rgba(37, 99, 235, 0.15)' : 'transparent',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  color: '#FFFFFF',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 36,
                  color: section.active ? 'primary.light' : '#94A3B8',
                }}
              >
                {section.icon}
              </ListItemIcon>
              <ListItemText
                primary={section.title}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  letterSpacing: '0.01em',
                }}
              />
              {section.open ? (
                <ExpandLess sx={{ fontSize: 18, color: '#94A3B8' }} />
              ) : (
                <ExpandMore sx={{ fontSize: 18, color: '#94A3B8' }} />
              )}
            </ListItemButton>

            <Collapse in={section.open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 2, pt: 0.5 }}>
                {section.subItems.map((item) => (
                  <ListItem disablePadding key={item.path}>
                    <ListItemButton
                      onClick={() => handleNav(item.path)}
                      sx={{
                        borderRadius: 2,
                        mb: 0.5,
                        px: 2,
                        py: 1,
                        bgcolor: item.active ? 'primary.main' : 'transparent',
                        color: item.active ? '#FFFFFF' : '#94A3B8',
                        position: 'relative',
                        '&:hover': {
                          bgcolor: item.active ? 'primary.dark' : 'rgba(255, 255, 255, 0.05)',
                          color: '#FFFFFF',
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 32,
                          color: item.active ? '#FFFFFF' : '#64748B',
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: '0.8125rem',
                          fontWeight: item.active ? 700 : 500,
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Sidebar;
