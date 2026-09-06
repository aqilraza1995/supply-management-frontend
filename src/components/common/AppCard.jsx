import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';

export const AppCard = ({
  title,
  subheader,
  action,
  children,
  headerSx,
  contentSx,
  divider = false,
  ...props
}) => {
  return (
    <Card {...props}>
      {(title || action) && (
        <>
          <CardHeader
            title={title}
            subheader={subheader}
            action={action}
            titleTypographyProps={{ variant: 'h6', fontWeight: 700 }}
            subheaderTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
            sx={{ px: 3, py: 2, ...headerSx }}
          />
          {divider && <Divider />}
        </>
      )}
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 }, ...contentSx }}>
        {children}
      </CardContent>
    </Card>
  );
};

export default AppCard;
