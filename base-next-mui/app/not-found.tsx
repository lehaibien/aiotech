'use client'

import { Box, Button, Container, Typography, useTheme } from '@mui/material'
import Head from 'next/head'
import { useRouter } from 'next/navigation'

export default function Custom404() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <>
      <Head>
        <title>404 | AioTech</title>
        <meta name="description" content="Trang bạn đang tìm kiếm không tồn tại." />
      </Head>
      <Container maxWidth="md">
        <Box
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
              d="M80 90L120 110M120 90L80 110"
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
        </Box>
      </Container>
    </>
  )
}