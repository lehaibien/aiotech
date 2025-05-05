"use client";

import { Box, Button, Container, SimpleGrid, Text, Title } from "@mantine/core";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 | AioTech</title>
        <meta
          name="description"
          content="Trang bạn đang tìm kiếm không tồn tại."
        />
      </Head>
      <Container
        size="lg"
        p={{
          base: "xl",
          md: 80,
        }}
        w="100vw"
        h="100vh"
      >
        <SimpleGrid
          spacing={{ base: "lg", sm: "xl" }}
          cols={{ base: 1, sm: 2 }}
        >
          <Box
            display={{
              base: "block",
              md: "none",
            }}
          >
            <Image
              src="/images/404.svg"
              alt="404"
              width={250}
              height={150}
              style={{
                margin: "auto",
              }}
            />
          </Box>
          <div>
            <Title>Có gì đó không đúng...</Title>
            <Text c="dimmed" size="lg">
              Trang bạn đang tìm kiếm không tồn tại. Bạn có thể đã nhập sai địa
              chỉ, hoặc trang đã bị chuyển sang một URL khác. Nếu bạn nghĩ đây
              là lỗi, hãy liên hệ với chúng tôi.
            </Text>
            <Button
              variant="outline"
              size="md"
              mt="xl"
              component={Link}
              href="/"
            >
              Quay lại trang chủ
            </Button>
          </div>
          <Box
            display={{
              base: "none",
              md: "block",
            }}
          >
            <Image src="/images/404.svg" alt="404" width={500} height={300} />
          </Box>
        </SimpleGrid>
        {/* <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            textAlign: 'center',
          }}
        >
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="200" height="200" fill={theme.palette.background.default} />
            <path
              d="M50 100H150"
              stroke={theme.palette.primary.main}
              strokeWidth="4"
              strokeLinecap="round"
            />
            <rect
              x="60"
              y="70"
              width="80"
              height="60"
              rx="2"
              stroke={theme.palette.secondary.main}
              strokeWidth="4"
            />
            <path
              d="M80 90L1 20 110M120 90L80 110"
              stroke={theme.palette.error.main}
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
          <Typography variant="h1" component="h1" gutterBottom sx={{ fontSize: '4rem' }}>
            404
          </Typography>
          <Typography variant="h4" component="h2" gutterBottom>
            Không tìm thấy
          </Typography>
          <Typography variant="body1" paragraph>
            Trang bạn đang tìm kiếm không tồn tại hoặc đã bị chuyển sang trang khác.
          </Typography>
          <Button
            onClick={() => router.back()}
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 2 }}
          >
            Quay lại
          </Button>
        </Box> */}
      </Container>
    </>
  );
}
