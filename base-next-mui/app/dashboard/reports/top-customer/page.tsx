import { API_URL } from "@/constant/apiUrl";
import { getApiQuery } from "@/lib/apiClient";
import { TopCustomerReportRequest, TopCustomerReportResponse } from "@/types";
import { Box, Typography } from "@mui/material";
import TopCustomerChart from "./TopCustomerChart";
import TopCustomerGrid from "./TopCustomerGrid";
import dayjs from "@/lib/extended-dayjs";
import utc from "dayjs/plugin/utc";
import TopCustomerFilter from "./TopCustomerFilter";

dayjs.extend(utc);

async function getTopCustomerData(request: TopCustomerReportRequest) {
  const response = await getApiQuery(API_URL.topCustomerReport, request);
  if (!response.success) {
    return [];
  }
  return response.data as TopCustomerReportResponse[];
}

export default async function TopCustomerReportPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const startDate = searchParams?.start_date
    ? dayjs.utc(searchParams?.start_date)
    : dayjs.utc().startOf("year");
    const endDate = searchParams?.end_date
    ? dayjs.utc(searchParams?.end_date)
    : dayjs.utc().endOf("year");
  const count = searchParams?.count ? Number(searchParams?.count) : 10;
  const request: TopCustomerReportRequest = {
    startDate: startDate.startOf("month").toJSON(),
    endDate: endDate.endOf("month").toJSON(),
    count: count,
  };
  const data = await getTopCustomerData(request);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h4" component="h1">
        Khách hàng mua hàng nhiều nhất
      </Typography>

      <TopCustomerFilter
        defaultStartDate={startDate}
        defaultEndDate={endDate}
        defaultCount={count}
      />
      <TopCustomerChart data={data} />
      <TopCustomerGrid data={data} />
    </Box>
  );
}
