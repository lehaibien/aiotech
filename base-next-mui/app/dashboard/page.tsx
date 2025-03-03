import KPISection from '@/features/dashboard/KPISection';
import RecentOrders from '@/features/dashboard/RecentOrder';
import RevenueChart from '@/features/dashboard/RevenueChart';
import StockAlert from '@/features/dashboard/StockAlert';
import TopSelling from '@/features/dashboard/TopSelling';
import { Grid2 as Grid, Paper, Typography } from '@mui/material';

export default function Page() {
  return (
    <>
      <Typography variant='h5' sx={{ mb: 3 }}>
        Trang tổng quan
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <KPISection />
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper elevation={2} className='p-4 h-full'>
            <Typography variant='h6' gutterBottom>
              Biểu đồ doanh thu
            </Typography>
            <RevenueChart />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper elevation={2} className='p-4 h-full'>
            <Typography variant='h6' gutterBottom>
              Danh sách sản phẩm bán chạy
            </Typography>
            <TopSelling />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper elevation={2} className='p-4'>
            <Typography variant='h6' gutterBottom>
              Đơn hàng gần đây
            </Typography>
            <RecentOrders />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper elevation={2} className='p-4'>
            <Typography variant='h6' gutterBottom>
              Cảnh báo hàng tồn kho
            </Typography>
            <StockAlert />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
