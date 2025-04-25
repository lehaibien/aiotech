import Footer from '@/components/layout/base/Footer';
import Header from '@/components/layout/base/Header';
import { Container } from '@mui/material';
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
  applicationName: 'AioTech',
};

/**
 * Provides the main application layout with a header, footer, and a centered content area.
 *
 * Renders the {@link Header} and {@link Footer} components around the main content, which is displayed inside a Material-UI {@link Container} with maximum width and vertical padding.
 *
 * @param children - The page content to display within the layout.
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <Container
        maxWidth='xl'
        component='main'
        sx={{ py: 2 }}>
        {children}
      </Container>
      <Footer />
    </>
  );
}
