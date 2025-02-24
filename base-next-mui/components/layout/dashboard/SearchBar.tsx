'use client';

import { useState } from 'react';

import { Close, Search } from '@mui/icons-material';
import {
  Box,
  Drawer,
  IconButton,
  Input,
  useMediaQuery,
  useTheme,
} from '@mui/material';

export default function SearchBar() {
  // drawer top
  const [showDrawer, setShowDrawer] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerClose = () => {
    setShowDrawer(false);
  };
  return (
    <>
      <IconButton
        aria-label='show 4 new mails'
        aria-controls='search-menu'
        aria-haspopup='true'
        onClick={() => setShowDrawer(true)}
        size='large'
      >
        <Search width={22} height={22} />
      </IconButton>
      <Drawer
        anchor='top'
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            padding: '15px 30px',
            width: isMobile ? '100%' : '50%',
            margin: 'auto',
          },
        }}
      >
        <Box display='flex' alignItems='center'>
          <Input
            placeholder='Tìm kiếm chức năng...'
            aria-label='description'
            fullWidth
          />
          <Box
            display='flex'
            sx={{
              ml: 'auto',
            }}
          >
            <IconButton>
              <Search width={20} height={20} />
            </IconButton>
            <IconButton onClick={handleDrawerClose}>
              <Close width={20} height={20} />
            </IconButton>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
