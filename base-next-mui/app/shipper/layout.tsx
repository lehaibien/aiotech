'use client';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import * as React from 'react';

dayjs.locale('vi');

export default function ShipperLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Box display='flex' flexDirection='column' minHeight='100vh'>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' component='div'>
            AioTech giao hàng
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component='main' flexGrow={1} p={3}>
        {children}
      </Box>
    </Box>
  );
}