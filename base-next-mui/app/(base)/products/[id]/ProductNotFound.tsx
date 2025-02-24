'use client';

import {
  Home as HomeIcon,
  Search as SearchIcon,
  ShoppingBag as ShoppingBagIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  IconButton,
  TextField,
  Typography
} from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';

export default function ProductNotFound() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would implement the search functionality here
    console.log('Searching for:', searchQuery);
  };

  return (
    <Container maxWidth='sm'>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}>
        <ShoppingBagIcon
          sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }}
        />
        <Typography
          variant='h4'
          component='h1'
          gutterBottom>
          Sản phẩm không tồn tại
        </Typography>
        <Typography
          variant='subtitle1'
          color='text.secondary'
          sx={{ mb: 4 }}>
          Chúng tôi không thể tìm thấy sản phẩm mà bạn cần.
        </Typography>
        <Box
          component='form'
          onSubmit={handleSearch}
          sx={{ width: '100%', mb: 4 }}>
          <TextField
            fullWidth
            variant='outlined'
            placeholder='Tìm kiếm sản phẩm...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton
                  type='submit'
                  edge='end'>
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
        </Box>
        {/* <Stack
          spacing={2}
          sx={{ mb: 4 }}>
          <Typography
            variant='body1'
            color='text.secondary'>
            Hoặc tham khảo các danh mục nổi bật:
          </Typography>
          <Stack
            direction='row'
            spacing={2}
            justifyContent='center'>
            <Button
              variant='outlined'
              component={Link}
              href='/products/electronics'>
              Electronics
            </Button>
            <Button
              variant='outlined'
              component={Link}
              href='/products/clothing'>
              Clothing
            </Button>
            <Button
              variant='outlined'
              component={Link}
              href='/products/books'>
              Books
            </Button>
          </Stack>
        </Stack> */}
        <Button
          variant='outlined'
          component={Link}
          href='/products'
          startIcon={<HomeIcon />}>
          Quay trở về trang cửa hàng
        </Button>
      </Box>
    </Container>
  );
}
