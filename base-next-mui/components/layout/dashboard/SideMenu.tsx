'use client';

import { Box, Drawer } from '@mui/material';
import MenuContent from './MenuContent';
import { useContext } from 'react';
import { DashboardMenuContext } from '../../dashboard/context/DashboardMenuContext';

const drawerWidth = 240;

export default function SideMenu() {
  const [open] = useContext(DashboardMenuContext);
  return (
    <Drawer
      anchor='left'
      open={open}
      variant='persistent'
      sx={{
        zIndex: 1,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          top: 'unset',
        },
        display: { xs: 'none', md: 'block' },
      }}
    >
      <Box
        sx={{
          flexShrink: 0,
          boxSizing: 'border-box',
        }}
      >
        <MenuContent />
      </Box>
    </Drawer>
  );
}
