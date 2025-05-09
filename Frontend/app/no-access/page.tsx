'use client';

import { Container, Stack, Title, Text, Button } from '@mantine/core';
import Head from 'next/head';
import { useRouter } from 'next/navigation';

export default function NoAccess() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>No Access | AioTech</title>
        <meta
          name='description'
          content='Trang bạn đang tìm kiếm không tồn tại.'
        />
      </Head>
      <Container size="md">
        <Stack align="center" justify="center" h="100vh" ta="center">
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="200"
              height="200"
              fill="#f8f9fa"
            />
            <path
              d="M50 100H150"
              stroke="#228be6"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <rect
              x="60"
              y="70"
              width="80"
              height="60"
              rx="2"
              stroke="#fd7e14"
              strokeWidth="4"
            />
            <path
              d="M80 90L120 110M120 90L80 110"
              stroke="#fa5252"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
          <Title order={1} size="4rem">
            403
          </Title>
          <Title order={2}>
            Không có quyền truy cập
          </Title>
          <Text size="md">
            Bạn không có quyền truy cập trang này. Vui lòng thử lại hoặc liên hệ
            với quản trị viên.
          </Text>
          <Button
            onClick={() => router.back()}
            size="lg"
            mt="md"
          >
            Quay lại
          </Button>
        </Stack>
      </Container>
    </>
  );
}
