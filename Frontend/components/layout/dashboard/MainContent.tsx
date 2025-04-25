'use client';

import { DashboardMenuContext } from '@/contexts/DashboardMenuProvider';
import { Box } from '@mui/material';
import { useContext } from 'react';
import SideMenu from './SideMenu';

export default function MainContent({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [open] = useContext(DashboardMenuContext);
  return (
    <Box
      display='flex'
      maxWidth='100vw'>
      <SideMenu />
      <Box
        component='main'
        minHeight='82vh'
        sx={(theme) => ({
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          width: {
            xs: '100%',
            md: open ? 'calc(100% - 240px)' : '100%',
          },
          pl: { xs: 2, sm: 3, md: 4 },
          pr: 2,
          pt: 2,
          mt: { xs: 8, md: 0 },
          ml: {
            xs: 0,
            md: open ? '240px' : 0,
          },
        })}>
        {children}
      </Box>
    </Box>
  );
}
