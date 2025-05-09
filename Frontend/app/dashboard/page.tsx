import { API_URL } from "@/constant/apiUrl";
import { KPISection } from "@/features/dashboard/KPISection";
import { RecentOrders } from "@/features/dashboard/RecentOrder";
import { RevenueChart } from "@/features/dashboard/RevenueChart";
import { StockAlertSection } from "@/features/dashboard/StockAlert";
import { TopSelling } from "@/features/dashboard/TopSelling";
import { getApi, getApiQuery } from "@/lib/apiClient";
import { formatNumberWithSeperator } from "@/lib/utils";
import {
  DashboardCard,
  DashboardSale,
  DashboardTopProduct,
  OrderResponse,
  StockAlert,
} from "@/types";
import { Grid, GridCol, Stack, Text, Title } from "@mantine/core";
import { DollarSign, LucideIcon, Receipt, User } from "lucide-react";

type KPI = {
  title: string;
  value: string;
  percentageChange: number;
  icon: LucideIcon;
};

export default async function Page() {
  let kpi: KPI[] = [];
  let saleData: DashboardSale[] = [];
  let topProducts: DashboardTopProduct[] = [];
  let recentOrders: OrderResponse[] = [];
  let stockAlerts: StockAlert[] = [];
  const kpiPromise = getApi(API_URL.dashboardCard);
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
        title: "Doanh thu",
        value: formatNumberWithSeperator(data.revenue),
        percentageChange: data.revenueDiff,
        icon: DollarSign,
      },
      {
        title: "Đơn hàng mới",
        value: data.order.toString(),
        percentageChange: data.orderDiff,
        icon: Receipt,
      },
      {
        title: "Trung bình đơn hàng",
        value: formatNumberWithSeperator(data.averageOrderValue),
        percentageChange: data.averageOrderValueDiff,
        icon: DollarSign,
      },
      {
        title: "Khách hàng mới",
        value: data.newUser.toString(),
        percentageChange: data.newUserDiff,
        icon: User,
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
    <Stack>
      <Title order={5}>Trang tổng quan</Title>
      <Grid>
        {/* <GridCol span={{ xs: 12 }}>
          <KPISection data={kpi} />
        </GridCol> */}

        <GridCol span={{ xs: 12, lg: 8 }} h={500}>
          <Text size="lg">Biểu đồ doanh thu</Text>
          <RevenueChart data={saleData} />
        </GridCol>
        <GridCol
          span={{ xs: 12, lg: 4 }}
          h={500}
          style={{
            overflowY: "auto",
          }}
        >
          <Text size="lg">Sản phẩm bán chạy</Text>
          <TopSelling data={topProducts} />
        </GridCol>
        <GridCol span={{ xs: 12, lg: 8 }} h={500}>
          <Text size="lg">Đơn hàng gần đây</Text>
          <RecentOrders data={recentOrders} />
        </GridCol>
        <GridCol
          span={{ xs: 12, lg: 4 }}
          h={500}
          style={{
            overflowY: "auto",
          }}
        >
          <Text size="lg">Cảnh báo hàng tồn kho</Text>
          <StockAlertSection data={stockAlerts} />
        </GridCol>
      </Grid>
    </Stack>
  );
}
