import { API_URL } from "@/constant/apiUrl";
import KPISection from "@/features/dashboard/KPISection";
import { RecentOrders } from "@/features/dashboard/RecentOrder";
import RevenueChart from "@/features/dashboard/RevenueChart";
import StockAlert from "@/features/dashboard/StockAlert";
import TopSelling from "@/features/dashboard/TopSelling";
import { getApiQuery } from "@/lib/apiClient";
import { OrderResponse } from "@/types";
import { Grid2 as Grid, Paper, Typography } from "@mui/material";

export default async function Page() {
  let recentOrders: OrderResponse[] = [];
  const recentOrdersPromise = getApiQuery(API_URL.recentOrder, {
    count: 10,
  });
  const [recentOrdersResponse] = await Promise.all([recentOrdersPromise]);
  if (recentOrdersResponse.success) {
    recentOrders = recentOrdersResponse.data as OrderResponse[];
  }
  return (
    <>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Trang tổng quan
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <KPISection />
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper elevation={2} className="p-4 h-full">
            <Typography variant="h6" gutterBottom>
              Biểu đồ doanh thu
            </Typography>
            <RevenueChart />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper elevation={2} className="p-4 h-full">
            <Typography variant="h6" gutterBottom>
              Danh sách sản phẩm bán chạy
            </Typography>
            <TopSelling />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper elevation={2} sx={{
            p: 2,
            height: 500,
          }}>
            <Typography variant="h6" gutterBottom>
              Đơn hàng gần đây
            </Typography>
            <RecentOrders data={recentOrders} />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper elevation={2} className="p-4">
            <Typography variant="h6" gutterBottom>
              Cảnh báo hàng tồn kho
            </Typography>
            <StockAlert />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
