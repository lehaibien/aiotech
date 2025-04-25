import { API_URL } from "@/constant/apiUrl";
import TopCustomerChart from "@/features/dashboard/reports/top-customer/TopCustomerChart";
import TopCustomerFilter from "@/features/dashboard/reports/top-customer/TopCustomerFilter";
import TopCustomerGrid from "@/features/dashboard/reports/top-customer/TopCustomerGrid";
import { getApiQuery } from "@/lib/apiClient";
import dayjs from "@/lib/extended-dayjs";
import {
  SearchParams,
  TopCustomerReportRequest,
  TopCustomerReportResponse,
} from "@/types";
import { Stack, Typography } from "@mui/material";

/**
 * Retrieves top customer report data based on the specified request parameters.
 *
 * @param request - The parameters defining the date range and count for the report.
 * @returns An array of {@link TopCustomerReportResponse} objects, or an empty array if the API request fails.
 */
async function getTopCustomerData(request: TopCustomerReportRequest) {
  const response = await getApiQuery(API_URL.topCustomerReport, request);
  if (!response.success) {
    return [];
  }
  return response.data as TopCustomerReportResponse[];
}

/**
 * Displays the top customer report page with filters, chart, and grid based on provided search parameters.
 *
 * Parses date and count parameters from {@link searchParams}, fetches top customer data for the specified range and count, and renders the report layout.
 *
 * @param searchParams - Query parameters specifying the date range and number of customers to include in the report.
 * @returns The JSX layout for the top customer report page.
 */
export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { start_date, end_date, count } = await searchParams;
  const startDate = start_date
    ? dayjs.utc(start_date)
    : dayjs.utc().startOf("year").add(1, "day");
  const endDate = end_date
    ? dayjs.utc(end_date)
    : dayjs.utc().endOf("year").subtract(1, "day");
  const fetchCount = count ? Number(count) : 10;
  const request: TopCustomerReportRequest = {
    startDate: startDate.startOf("month").toJSON(),
    endDate: endDate.endOf("month").toJSON(),
    count: fetchCount,
  };
  const data = await getTopCustomerData(request);

  return (
    <Stack spacing={2}>
      <Typography variant="h5">
        Báo cáo khách hàng mua hàng nhiều nhất
      </Typography>

      <TopCustomerFilter
        defaultStartDate={startDate.toDate()}
        defaultEndDate={endDate.toDate()}
      />
      <TopCustomerChart data={data} />
      <TopCustomerGrid data={data} />
    </Stack>
  );
}
