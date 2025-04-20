import { API_URL } from '@/constant/apiUrl';
import KPISection from '@/features/dashboard/KPISection';
import { RecentOrders } from '@/features/dashboard/RecentOrder';
import { RevenueChart } from '@/features/dashboard/RevenueChart';
import { StockAlertSection } from '@/features/dashboard/StockAlert';
import { TopSelling } from '@/features/dashboard/TopSelling';
import { getApi, getApiQuery } from '@/lib/apiClient';
import { formatNumberWithSeperator } from '@/lib/utils';
import {
  DashboardCard,
  DashboardSale,
  DashboardTopProduct,
  OrderResponse,
  StockAlert,
} from '@/types';
import UserIcon from '@mui/icons-material/AccountCircleOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoneyOutlined';
import OrderIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Grid, Paper, SvgIconTypeMap, Typography } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

type KPI = {
  title: string;
  value: string;
  percentageChange: number;
  icon: OverridableComponent<SvgIconTypeMap<object, 'svg'>> & {
    muiName: string;
  };
};

export default async function Page() {
  let kpi: KPI[] = [];
  let saleData: DashboardSale[] = [];
  let topProducts: DashboardTopProduct[] = [];
  let recentOrders: OrderResponse[] = [];
  let stockAlerts: StockAlert[] = [];
  const kpiPromise = await getApi(API_URL.dashboardCard);
  const dashboardSalePromise = getApi(API_URL.dashboardSale);
  const topProductsPromise = getApi(API_URL.dashboardTopProduct);
  const recentOrdersPromise = getApiQuery(API_URL.recentOrder, {
    count: 10,
  });
  const stockAlertPromise = getApi(API_URL.dashboardStockAlert);
  const [
    kpiResponse,
    dashboardSaleResponse,
    topProductsResponse,
    recentOrdersResponse,
    stockAlertResponse,
  ] = await Promise.all([
    kpiPromise,
    dashboardSalePromise,
    topProductsPromise,
    recentOrdersPromise,
    stockAlertPromise,
  ]);
  if (kpiResponse.success) {
    const data = kpiResponse.data as DashboardCard;
    kpi = [
      {
        title: 'Doanh thu',
        value: formatNumberWithSeperator(data.revenue),
        percentageChange: data.revenueDiff,
        icon: AttachMoneyIcon,
      },
      {
        title: 'Đơn hàng mới',
        value: data.order.toString(),
        percentageChange: data.orderDiff,
        icon: OrderIcon,
      },
      {
        title: 'Trung bình đơn hàng',
        value: formatNumberWithSeperator(data.averageOrderValue),
        percentageChange: data.averageOrderValueDiff,
        icon: AttachMoneyIcon,
      },
      {
        title: 'Khách hàng mới',
        value: data.newUser.toString(),
        percentageChange: data.newUserDiff,
        icon: UserIcon,
      },
    ];
  }
  if (dashboardSaleResponse.success) {
    saleData = dashboardSaleResponse.data as DashboardSale[];
  }
  if (topProductsResponse.success) {
    topProducts = topProductsResponse.data as DashboardTopProduct[];
  }
  if (recentOrdersResponse.success) {
    recentOrders = recentOrdersResponse.data as OrderResponse[];
  }
  if (stockAlertResponse.success) {
    stockAlerts = stockAlertResponse.data as StockAlert[];
  }
  return (
    <>
      <Typography
        variant='h5'
        sx={{ mb: 3 }}>
        Trang tổng quan
      </Typography>
      <Grid
        container
        spacing={3}>
        <Grid size={{ xs: 12 }}>
          <KPISection data={kpi} />
        </Grid>

        <Grid
          size={{ xs: 12, lg: 8 }}
          sx={{
            height: 500,
          }}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography
              variant='h6'
              gutterBottom>
              Biểu đồ doanh thu
            </Typography>
            <RevenueChart data={saleData} />
          </Paper>
        </Grid>
        <Grid
          size={{ xs: 12, lg: 4 }}
          sx={{
            height: 500,
            overflowY: 'auto',
          }}>
          <Paper sx={{ p: 2, minHeight: '100%' }}>
            <Typography
              variant='h6'
              gutterBottom>
              Danh sách sản phẩm bán chạy
            </Typography>
            <TopSelling data={topProducts} />
          </Paper>
        </Grid>
        <Grid
          size={{ xs: 12, lg: 8 }}
          sx={{
            height: 500,
          }}>
          <Paper
            sx={{
              height: '100%',
            }}>
            <Typography
              variant='h6'
              gutterBottom
              sx={{
                px: 2,
                pt: 2,
              }}>
              Đơn hàng gần đây
            </Typography>
            <RecentOrders data={recentOrders} />
          </Paper>
        </Grid>
        <Grid
          size={{ xs: 12, lg: 4 }}
          sx={{
            height: 500,
            overflowY: 'auto',
          }}>
          <Paper
            elevation={2}
            sx={{ p: 2 }}>
            <Typography
              variant='h6'
              gutterBottom>
              Cảnh báo hàng tồn kho
            </Typography>
            <StockAlertSection data={stockAlerts} />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
