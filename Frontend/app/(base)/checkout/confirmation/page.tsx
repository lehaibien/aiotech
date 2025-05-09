'use client';

import { Container, Stack, Title, Text, Button } from '@mantine/core';
import { useRouter } from 'next/navigation';

const OrderSuccessPage = () => {
  const router = useRouter();

  return (
    <Container size="sm" py={32} ta="center">
      {/* Cool SVG Illustration */}
      <Stack align="center" gap="lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={150}
          height={150}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4CAF50"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>

        {/* Order Confirmation Message */}
        <Title order={2} fw={700}>
          Đặt hàng thành công
        </Title>
        <Text size="md">
          Cảm ơn bạn đã mua hàng. Đơn hàng của bạn sẽ nhanh chóng được giao. Vui
          lòng kiểm tra email và chờ cuộc gọi giao hàng từ điện thoại.
        </Text>

        {/* Order Details */}
        {/* <Paper shadow="xs" p="md" bg="gray.0" radius="md">
          <Text>
            Mã đơn hàng: <strong>{orderDetails.orderId}</strong>
          </Text>
          <Text>
            Tổng thanh toán: <strong>{orderDetails.total}</strong>
          </Text>
        </Paper> */}

        <Button
          size="lg"
          onClick={() => router.push('/products')}
          mt="md"
        >
          Tiếp tục mua hàng
        </Button>
      </Stack>
    </Container>
  );
};

export default OrderSuccessPage;
