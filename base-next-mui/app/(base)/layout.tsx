import 'server-only';

import Footer from '@/components/layout/base/Footer';
import Header from '@/components/layout/base/Header';
import { Box, Container } from '@mui/material';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: {
    default: 'Aiotech',
    template: '%s | Aiotech',
  },
  description:
    'Aiotech is a place for everyone to buy electronic parts, computer parts, pc, laptop and gaming gear.',
  keywords: ['e-commerce', 'technology', 'tech', 'shopping', 'pc', 'laptop'],
  applicationName: 'AioTech'
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Container maxWidth='xl'>
      <Header />
      <Box component='main' sx={{ py: 2 }}>
        {children}
      </Box>
      <Footer />
    </Container>
  );
}
