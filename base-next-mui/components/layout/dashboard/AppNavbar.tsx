'use client'

import BrandLogo from '@/components/core/BrandLogo';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { tabsClasses } from '@mui/material/Tabs';
import MuiToolbar from '@mui/material/Toolbar';
import * as React from 'react';
import Searchbar from './SearchBar';
import SideMenuMobile from './SideMenuMobile';
import MenuButton from '@/components/core/MenuButton';

const Toolbar = styled(MuiToolbar)({
  width: '100%',
  padding: '12px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  justifyContent: 'center',
  gap: '12px',
  flexShrink: 0,
  [`& ${tabsClasses.flexContainer}`]: {
    gap: '8px',
    p: '8px',
    pb: 0,
  },
});

export default function AppNavbar() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <AppBar
      position='fixed'
      sx={{
        display: { xs: 'auto', md: 'none' },
        boxShadow: 0,
        bgcolor: 'background.paper',
        backgroundImage: 'none',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar variant='regular'>
        <Stack
          direction='row'
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            flexGrow: 1,
            width: '100%',
          }}
        >
          <Stack direction='row' spacing={1} sx={{ justifyContent: 'center' }}>
              <BrandLogo />
          </Stack>
          <Box display='flex' alignItems='center'>
            <Searchbar />
            <MenuButton aria-label='menu' onClick={toggleDrawer(true)}>
              <MenuRoundedIcon />
            </MenuButton>
          </Box>
          <SideMenuMobile open={open} toggleDrawer={toggleDrawer} />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}