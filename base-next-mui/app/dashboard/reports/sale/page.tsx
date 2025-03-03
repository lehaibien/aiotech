import NavBreadcrumbs from "@/components/core/NavBreadcrumbs";
import { API_URL } from "@/constant/apiUrl";
import { getApiQuery } from "@/lib/apiClient";
import { SaleReportRequest, SaleReportResponse } from "@/types";
import {
  Box,
  Card,
  CardContent,
  Grid2 as Grid,
  Stack,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import "server-only";
import SaleReportFilter from "./SaleReportFilter";
import SalesChart from "./SalesChart";
import { formatNumberWithSeperator } from "@/lib/utils";
import utc from "dayjs/plugin/utc";
import { TrendingUp, ShoppingCart, AttachMoney, Cancel, CheckCircle } from "@mui/icons-material";

dayjs.extend(utc);

const breadcrums = [
  {
    label: "",
    href: "dashboard",
  },
  {
    label: "Báo cáo doanh thu",
    href: "sale",
  },
];

export default async function SaleReportPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const startDate = searchParams?.start_date
    ? dayjs.utc(searchParams?.start_date)
    : dayjs.utc().startOf("year");
  const endDate = searchParams?.end_date
    ? dayjs(searchParams?.end_date)
    : dayjs.utc().endOf("year");
  const request: SaleReportRequest = {
    startDate: startDate.startOf("month").toJSON(),
    endDate: endDate.endOf("month").toJSON(),
  };
  let chartData: SaleReportResponse[] = [];
  const response = await getApiQuery(API_URL.saleReport, request);
  if (response.success) {
    chartData = response.data as SaleReportResponse[];
  } else {
    console.error(response.message);
  }

  const total = chartData
    .map((x) => x.revenue)
    .reduce((prev, curr) => prev + curr, 0);

  const totalOrders = chartData
    .map((x) => x.totalOrder)
    .reduce((prev, curr) => prev + curr, 0);

  const totalCompletedOrders = chartData
    .map((x) => x.completedOrder)
    .reduce((prev, curr) => prev + curr, 0);

  const totalCancelledOrders = chartData
    .map((x) => x.cancelledOrder)
    .reduce((prev, curr) => prev + curr, 0);

  const averageOrderValue = totalOrders > 0 ? total / totalOrders : 0;

  return (
    <Stack spacing={3}>
      <NavBreadcrumbs items={breadcrums} />
      <Typography variant="h4" gutterBottom>
        Báo cáo doanh thu
      </Typography>
      <Typography color="text.secondary" gutterBottom>
        {dayjs(startDate).format("MM/YYYY")} {" - "}
        {dayjs(endDate).format("MM/YYYY")}
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <SaleReportFilter
          defaultStartDate={startDate.toDate()}
          defaultEndDate={endDate.toDate()}
        />
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <TrendingUp color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Tổng doanh thu
                  </Typography>
                  <Typography variant="h5">
                    {formatNumberWithSeperator(total)} đ
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <ShoppingCart color="secondary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Tổng đơn hàng
                  </Typography>
                  <Typography variant="h5">
                    {formatNumberWithSeperator(totalOrders)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <AttachMoney color="success" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Giá trị trung bình/đơn hàng
                  </Typography>
                  <Typography variant="h5">
                    {formatNumberWithSeperator(averageOrderValue)} đ
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <CheckCircle color="success" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Đơn hàng hoàn thành
                  </Typography>
                  <Typography variant="h5">
                    {formatNumberWithSeperator(totalCompletedOrders)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Cancel color="error" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Đơn hàng đã hủy
                  </Typography>
                  <Typography variant="h5">
                    {formatNumberWithSeperator(totalCancelledOrders)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Biểu đồ doanh thu theo thời gian
              </Typography>
              <SalesChart data={chartData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
