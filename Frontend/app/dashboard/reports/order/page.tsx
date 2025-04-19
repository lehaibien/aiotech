import NavBreadcrumbs from "@/components/core/NavBreadcrumbs";
import { API_URL } from "@/constant/apiUrl";
import { getApiQuery } from "@/lib/apiClient";
import { formatNumberWithSeperator } from "@/lib/utils";
import { OrderReportRequest, OrderReportResponse } from "@/types";
import { Box, Typography } from "@mui/material";
import dayjs from "@/lib/extended-dayjs";
import utc from "dayjs/plugin/utc";
import "server-only";
import OrderReportFilter from "./OrderReportFilter";
import OrdersChart from "./OrdersChart";

dayjs.extend(utc);

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
  const customerUsername = searchParams?.customer_username ?? undefined;
  const breadcrums = [
    {
      label: "",
      href: "dashboard",
    },
    {
      label: "Báo cáo đơn hàng",
      href: "sale",
    },
  ];
  const request: OrderReportRequest = {
    startDate: startDate.startOf("month").toJSON(),
    endDate: endDate.endOf("month").toJSON(),
    customerUsername: customerUsername,
  };
  let chartData: OrderReportResponse[] = [];
  const response = await getApiQuery(API_URL.orderReport, request);
  if (response.success) {
    chartData = response.data as OrderReportResponse[];
  } else {
    console.error(response.message);
  }
  const total = chartData
    .map((x) => x.orderCount)
    .reduce((prev, curr) => prev + curr, 0);
  return (
    <>
      <NavBreadcrumbs items={breadcrums} />
      <Typography variant="h4">Báo cáo đơn hàng</Typography>
      <Typography gutterBottom>
        {dayjs(startDate).format("MM/YYYY")} {" - "}
        {dayjs(endDate).format("MM/YYYY")}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <OrderReportFilter
          defaultStartDate={startDate.toDate()}
          defaultEndDate={endDate.toDate()}
        />
      </Box>
      <OrdersChart data={chartData} />
      <Typography>
        Tổng số lượng đơn hàng: {formatNumberWithSeperator(total)} đ
      </Typography>
    </>
  );
}
