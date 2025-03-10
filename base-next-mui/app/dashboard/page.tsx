import { API_URL } from "@/constant/apiUrl";
import KPISection from "@/features/dashboard/KPISection";
import { RecentOrders } from "@/features/dashboard/RecentOrder";
import { RevenueChart } from "@/features/dashboard/RevenueChart";
import { StockAlert } from "@/features/dashboard/StockAlert";
import { TopSelling } from "@/features/dashboard/TopSelling";
import { getApi, getApiQuery } from "@/lib/apiClient";
import { formatNumberWithSeperator } from "@/lib/utils";
import { DashboardCard, OrderResponse, ProductResponse } from "@/types";
import UserIcon from "@mui/icons-material/AccountCircleOutlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoneyOutlined";
import OrderIcon from "@mui/icons-material/ShoppingCartOutlined";
import {
  Grid2 as Grid,
  Paper,
  SvgIconTypeMap,
  Typography,
} from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

interface KPI {
  title: string;
  value: string;
  percentageChange: number;
  icon: OverridableComponent<SvgIconTypeMap<object, "svg">> & {
    muiName: string;
  };
}

export default async function Page() {
  let kpi: KPI[] = [];
  let topProducts: ProductResponse[] = [];
  let recentOrders: OrderResponse[] = [];
  const kpiPromise = await getApi(API_URL.dashboard);
  const topProductsPromise = getApi(API_URL.productTop + "/7");
  const recentOrdersPromise = getApiQuery(API_URL.recentOrder, {
    count: 10,
  });
  const [kpiResponse, topProductsResponse, recentOrdersResponse] =
    await Promise.all([kpiPromise, topProductsPromise, recentOrdersPromise]);
  if (kpiResponse.success) {
    const data = kpiResponse.data as DashboardCard;
    kpi = [
      {
        title: "Doanh thu",
        value: formatNumberWithSeperator(data.revenue),
        percentageChange: data.revenueDiff,
        icon: AttachMoneyIcon,
      },
      {
        title: "Đơn hàng",
        value: data.order.toString(),
        percentageChange: data.orderDiff,
        icon: OrderIcon,
      },
      {
        title: "Trung bình đơn hàng",
        value: formatNumberWithSeperator(data.averageOrderValue),
        percentageChange: data.averageOrderValueDiff,
        icon: AttachMoneyIcon,
      },
      {
        title: "Khách hàng",
        value: data.newUser.toString(),
        percentageChange: data.newUserDiff,
        icon: UserIcon,
      },
    ];
  }
  if (topProductsResponse.success) {
    topProducts = topProductsResponse.data as ProductResponse[];
  }
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
          <KPISection data={kpi} />
        </Grid>

        <Grid
          size={{ xs: 12, lg: 8 }}
          sx={{
            height: 500,
          }}
        >
          <Paper elevation={2} sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Biểu đồ doanh thu
            </Typography>
            <RevenueChart />
          </Paper>
        </Grid>
        <Grid
          size={{ xs: 12, lg: 4 }}
          sx={{
            height: 500,
            overflowY: "auto",
          }}
        >
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Danh sách sản phẩm bán chạy
            </Typography>
            <TopSelling data={topProducts} />
          </Paper>
        </Grid>
        <Grid
          size={{ xs: 12, lg: 8 }}
          sx={{
            height: 500,
          }}
        >
          <Paper
            elevation={2}
            sx={{
              p: 2,
              height: "100%",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Đơn hàng gần đây
            </Typography>
            <RecentOrders data={recentOrders} />
          </Paper>
        </Grid>
        <Grid
          size={{ xs: 12, lg: 4 }}
          sx={{
            height: 500,
            overflowY: "auto",
          }}
        >
          <Paper
            elevation={2}
            sx={{
              p: 2,
              height: "100%",
            }}
          >
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
