import { API_URL } from "@/constant/apiUrl";
import { getListApi } from "@/lib/apiClient";
import dayjs from "@/lib/extended-dayjs";
import {
  CategoryPerformanceReportRequest,
  CategoryPerformanceReportResponse,
  SearchParams,
} from "@/types";
import { Box, Stack, Typography } from "@mui/material";
import { Dayjs } from "dayjs";
import { CategoryPerformanceChart } from "./CategoryPerformanceChart";
import { CategoryPerformanceGrid } from "./CategoryPerformanceGrid";

/**
 * Retrieves category performance data for a specified date range.
 *
 * @param startDate - The start date of the reporting period.
 * @param endDate - The end date of the reporting period.
 * @returns An array of category performance report responses, or an empty array if the fetch fails.
 */
async function fetchCategoryPerformanceData(startDate: Dayjs, endDate: Dayjs) {
  const request: CategoryPerformanceReportRequest = {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  };
  const response = await getListApi(API_URL.categoryPerformanceReport, request);
  if (response.success) {
    return response.data as CategoryPerformanceReportResponse[];
  } else {
    console.error(
      "Error fetching category performance data:",
      response.message
    );
    return [];
  }
}

/**
 * Displays the category performance report page with charts and detailed data for a specified date range.
 *
 * Extracts the start and end dates from {@link searchParams}, defaults to the current year if not provided, fetches category performance data, and renders the top 10 categories by revenue along with a detailed grid.
 */
export default async function CategoryPerformancePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { start_date, end_date } = await searchParams;
  const startDate = start_date
    ? dayjs.utc(start_date)
    : dayjs.utc().startOf("year");
  const endDate = end_date ? dayjs(end_date) : dayjs.utc().endOf("year");
  const data = await fetchCategoryPerformanceData(startDate, endDate);
  const top10Categories = data
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 10);

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Báo cáo hiệu suất danh mục</Typography>

      <Box>
        <Typography variant="h6" gutterBottom>
          Top 10 danh mục theo doanh thu
        </Typography>
        <Box sx={{ width: "100%", height: 400 }}>
          <CategoryPerformanceChart data={top10Categories} />
        </Box>
      </Box>
      <Box>
        <Typography variant="h6" gutterBottom>
          Chi tiết hiệu suất danh mục
        </Typography>
        <Box sx={{ height: 600, width: "100%" }}>
          <CategoryPerformanceGrid data={data} />
        </Box>
      </Box>
    </Stack>
  );
}
