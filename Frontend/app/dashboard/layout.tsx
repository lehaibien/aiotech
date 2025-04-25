import DashboardMenuProvider from '@/contexts/DashboardMenuProvider';
import AppNavbar from '@/components/layout/dashboard/AppNavbar';
import Header from '@/components/layout/dashboard/Header';
import MainContent from '@/components/layout/dashboard/MainContent';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';
import 'dayjs/locale/vi'; // You might need this if you want Vietnamese locale support later.
import * as React from 'react';

dayjs.locale('vi');

export default async function Dashboard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardMenuProvider>
      <Box display='flex' flexDirection='column'>
        <Header />
        <AppNavbar />
        {/* Main content */}
        <MainContent>{children}</MainContent>
      </Box>
    </DashboardMenuProvider>
  );
}
