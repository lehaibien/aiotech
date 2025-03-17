'use client';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import * as React from 'react';
import ShipperAccount from './ShipperAccount';

dayjs.locale('vi');

export default function ShipperLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Box display='flex' flexDirection='column' minHeight='100vh'>
      <AppBar position='static' color='default'>
        <Toolbar sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems:'center',
        }}>
          <Typography variant='h6'>
            AioTech giao hàng
          </Typography>
          <ShipperAccount />
        </Toolbar>
      </AppBar>
      <Box component='main' flexGrow={1} p={3}>
        {children}
      </Box>
    </Box>
  );
}