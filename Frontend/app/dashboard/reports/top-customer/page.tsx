import NavBreadcrumbs from "@/components/core/NavBreadcrumbs";
import { API_URL } from "@/constant/apiUrl";
import { getApiQuery } from "@/lib/apiClient";
import dayjs from "@/lib/extended-dayjs";
import { TopCustomerReportRequest, TopCustomerReportResponse } from "@/types";
import { Stack, Typography } from "@mui/material";
import TopCustomerChart from "./TopCustomerChart";
import TopCustomerFilter from "./TopCustomerFilter";
import TopCustomerGrid from "./TopCustomerGrid";

const breadcrums = [
  {
    label: "",
    href: "dashboard",
  },
  {
    label: "Báo cáo khách hàng mua hàng nhiều nhất",
    href: "/dashboard/reports/top-customer",
  },
];

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
    <Stack spacing={3}>
      <NavBreadcrumbs items={breadcrums} />
      <Typography variant="h4" component="h1">
        Báo cáo khách hàng mua hàng nhiều nhất
      </Typography>

      <TopCustomerFilter
        defaultStartDate={startDate}
        defaultEndDate={endDate}
        defaultCount={count}
      />
      <TopCustomerChart data={data} />
      <TopCustomerGrid data={data} />
    </Stack>
  );
}
