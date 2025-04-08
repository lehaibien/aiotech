'use client';

import { Box, Button, Container, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

const OrderSuccessPage = () => {
  const router = useRouter();

  return (
    <Container maxWidth='sm' sx={{ textAlign: 'center', mt: 8 }}>
      {/* Cool SVG Illustration */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='150'
          height='150'
          viewBox='0 0 24 24'
          fill='none'
          stroke='#4CAF50'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M22 11.08V12a10 10 0 1 1-5.93-9.14' />
          <polyline points='22 4 12 14.01 9 11.01' />
        </svg>
      </Box>

      {/* Order Confirmation Message */}
      <Typography
        variant='h4'
        component='h1'
        gutterBottom
        sx={{ fontWeight: 'bold' }}
      >
        Đặt hàng thành công
      </Typography>
      <Typography variant='body1' gutterBottom>
        Cảm ơn bạn đã mua hàng. Đơn hàng của bạn sẽ nhanh chóng được giao. Vui
        lòng kiểm tra email và chờ cuộc gọi giao hàng từ điện thoại.
      </Typography>

      {/* Order Details */}
      {/* <Box
        sx={{
          p: 3,
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
        }}
      >
        <Typography variant='body1' gutterBottom>
          Mã đơn hàng: <strong>{orderDetails.orderId}</strong>
        </Typography>
        <Typography variant='body1' gutterBottom>
          Tổng thanh toán: <strong>{orderDetails.total}</strong>
        </Typography>
      </Box> */}

      {/* Continue Shopping Button */}
      <Button
        variant='contained'
        color='primary'
        size='large'
        onClick={() => router.push('/products')}
        sx={{ mt: 2 }}
      >
        Tiếp tục mua hàng
      </Button>
    </Container>
  );
};

export default OrderSuccessPage;
