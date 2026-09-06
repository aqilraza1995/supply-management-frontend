import React from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: IconComponent,
  color = 'primary', // 'primary' | 'secondary' | 'warning' | 'error' | 'info'
  onClick,
  actionText = 'View details',
  sx,
}) => {
  const colorMap = {
    primary: {
      bg: 'rgba(37, 99, 235, 0.08)',
      text: '#2563EB',
      border: 'rgba(37, 99, 235, 0.2)',
    },
    secondary: {
      bg: 'rgba(5, 150, 105, 0.08)',
      text: '#059669',
      border: 'rgba(5, 150, 105, 0.2)',
    },
    warning: {
      bg: 'rgba(217, 119, 6, 0.08)',
      text: '#D97706',
      border: 'rgba(217, 119, 6, 0.2)',
    },
    error: {
      bg: 'rgba(220, 38, 38, 0.08)',
      text: '#DC2626',
      border: 'rgba(220, 38, 38, 0.2)',
    },
    info: {
      bg: 'rgba(2, 132, 199, 0.08)',
      text: '#0284C7',
      border: 'rgba(2, 132, 199, 0.2)',
    },
  };

  const scheme = colorMap[color] || colorMap.primary;

  const content = (
    <Box sx={{ p: 2.8 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'text.secondary',
          }}
        >
          {title}
        </Typography>
        {IconComponent && (
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              bgcolor: scheme.bg,
              color: scheme.text,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconComponent sx={{ fontSize: 24 }} />
          </Box>
        )}
      </Box>

      <Typography
        variant="h4"
        component="div"
        sx={{
          fontWeight: 800,
          color: '#0F172A',
          letterSpacing: '-0.02em',
          mb: 0.5,
        }}
      >
        {value}
      </Typography>

      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: onClick ? 1.5 : 0 }}>
          {subtitle}
        </Typography>
      )}

      {onClick && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            pt: 1,
            borderTop: '1px dashed #E2E8F0',
            color: scheme.text,
            fontWeight: 600,
            fontSize: '0.8125rem',
          }}
        >
          <span>{actionText}</span>
          <ArrowForwardIcon sx={{ fontSize: 14 }} />
        </Box>
      )}
    </Box>
  );

  return (
    <Card
      sx={{
        borderRadius: 3,
        border: '1px solid #E2E8F0',
        transition: 'all 0.2s ease-in-out',
        '&:hover': onClick
          ? {
              transform: 'translateY(-2px)',
              boxShadow: '0px 10px 20px rgba(15, 23, 42, 0.08)',
              borderColor: scheme.border,
            }
          : undefined,
        ...sx,
      }}
    >
      {onClick ? (
        <CardActionArea onClick={onClick} sx={{ height: '100%' }}>
          {content}
        </CardActionArea>
      ) : (
        content
      )}
    </Card>
  );
};

export default StatCard;
