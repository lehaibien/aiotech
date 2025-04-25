import { API_URL } from "@/constant/apiUrl";
import { getListApi } from "@/lib/apiClient";
import dayjs from "@/lib/extended-dayjs";
import {
  BrandPerformanceReportRequest,
  BrandPerformanceReportResponse,
} from "@/types";
import { Box, Stack, Typography } from "@mui/material";
import { BrandPerformanceChart } from "./BrandPerformanceChart";
import { BrandPerformanceGrid } from "./BrandPerformanceGrid";

type SearchParams = Promise<{ [key: string]: string | undefined }>;

/**
 * Displays the brand performance report page with charts and detailed data.
 *
 * Fetches brand performance data for a specified date range, then renders a chart of the top 10 brands by revenue and a detailed grid of all brand performance metrics.
 *
 * @param searchParams - A promise resolving to an object containing optional `start_date` and `end_date` parameters in string format.
 *
 * @returns A React server component rendering the brand performance report.
 *
 * @remark If no date range is provided, the report defaults to the current calendar year.
 */
export default async function BrandPerformancePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { start_date, end_date } = await searchParams;
  let data: BrandPerformanceReportResponse[] = [];
  const startDate = start_date ? dayjs(start_date) : dayjs().startOf("year");
  const endDate = end_date ? dayjs(end_date) : dayjs().endOf("year");
  const request: BrandPerformanceReportRequest = {
    startDate: startDate.toJSON(),
    endDate: endDate.toJSON(),
  };
  const response = await getListApi(API_URL.brandPerformanceReport, request);
  if (response.success) {
    data = response.data as BrandPerformanceReportResponse[];
  } else {
    console.error("Error fetching brand performance data:", response.message);
  }

  const top10Categories = data
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 10);

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Báo cáo hiệu suất thương hiệu</Typography>

      <Box>
        <Typography variant="h6" gutterBottom>
          Top 10 thương hiệu theo doanh thu
        </Typography>
        <Box sx={{ width: "100%", height: 400 }}>
          <BrandPerformanceChart data={top10Categories} />
        </Box>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          Chi tiết hiệu suất thương hiệu
        </Typography>
        <Box sx={{ height: 600, width: "100%" }}>
          <BrandPerformanceGrid data={data} />
        </Box>
      </Box>
    </Stack>
  );
}
