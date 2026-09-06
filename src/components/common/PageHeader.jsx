import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useNavigate } from 'react-router-dom';

export const PageHeader = ({
  title,
  subtitle,
  breadcrumbs = [],
  action,
  sx,
}) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        mb: 3.5,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        ...sx,
      }}
    >
      <Box>
        {breadcrumbs.length > 0 && (
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" sx={{ color: 'text.disabled' }} />}
            aria-label="breadcrumb"
            sx={{ mb: 0.8 }}
          >
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return isLast || !crumb.path ? (
                <Typography
                  key={crumb.label}
                  variant="caption"
                  sx={{ color: 'text.secondary', fontWeight: 600 }}
                >
                  {crumb.label}
                </Typography>
              ) : (
                <Link
                  key={crumb.label}
                  underline="hover"
                  color="inherit"
                  sx={{ cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500 }}
                  onClick={() => navigate(crumb.path)}
                >
                  {crumb.label}
                </Link>
              );
            })}
          </Breadcrumbs>
        )}
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: '#0F172A' }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>

      {action && (
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', width: { xs: '100%', sm: 'auto' } }}>
          {action}
        </Box>
      )}
    </Box>
  );
};

export default PageHeader;
