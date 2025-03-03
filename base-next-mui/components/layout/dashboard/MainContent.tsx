'use client'

import { useContext } from 'react';
import { DashboardMenuContext } from '../../../providers/DashboardMenuProvider';
import { Box, Theme, useMediaQuery } from '@mui/material';
import SideMenu from './SideMenu';

export default function MainContent({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [open] = useContext(DashboardMenuContext);
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  return (
    <Box display='flex' maxWidth='100vw'>
      <SideMenu />
      <Box
        component='main'
        minHeight='82vh'
        width={!isMobile && open ? `calc(100% - 240px)` : '100%'}
        sx={(theme) => ({
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          pl: { xs: 2, sm: 3, md: 4 },
          pr: 2,
          pt: 2,
          mt: { xs: 8, md: 0 },
          ml: !isMobile && open ? '240px' : 0,
        })}
      >
        {children}
      </Box>
    </Box>
  );
}
