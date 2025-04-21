'use client';

import { Box, Card, CardContent, Stack, Typography } from '@mui/material';

type SaleCardProps = {
  title: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
};

export const SaleCard = ({ title, icon, children }: SaleCardProps) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack
          direction='row'
          alignItems='center'
          spacing={2}>
          {icon}
          <Box>
            <Typography
              color='text.secondary'
              gutterBottom>
              {title}
            </Typography>
            <Typography variant='h5'>{children}</Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};
