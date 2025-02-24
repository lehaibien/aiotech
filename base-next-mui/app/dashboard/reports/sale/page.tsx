import NavBreadcrumbs from "@/components/core/NavBreadcrumbs";
import { API_URL } from "@/constant/apiUrl";
import { getApiQuery } from "@/lib/apiClient";
import { SaleReportRequest, SaleReportResponse } from "@/types";
import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import "server-only";
import SaleReportFilter from "./SaleReportFilter";
import SalesChart from "./SalesChart";
import { formatNumberWithSeperator } from "@/lib/utils";
import utc from "dayjs/plugin/utc";

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
  const request: SaleReportRequest = {
    startDate: startDate.startOf("month").toJSON(),
    endDate: endDate.endOf("month").toJSON(),
  };
  console.log(request);
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
  return (
    <>
      <NavBreadcrumbs items={breadcrums} />
      <Typography variant="h4">Báo cáo doanh thu</Typography>
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
        <SaleReportFilter
          defaultStartDate={startDate.toDate()}
          defaultEndDate={endDate.toDate()}
        />
      </Box>
      <SalesChart data={chartData} />
      <Typography>
        Tổng doanh thu: {formatNumberWithSeperator(total)} đ
      </Typography>
    </>
  );
}
