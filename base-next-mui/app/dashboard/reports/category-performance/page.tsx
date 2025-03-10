import NavBreadcrumbs from "@/components/core/NavBreadcrumbs";
import { API_URL } from "@/constant/apiUrl";
import { getListApi } from "@/lib/apiClient";
import {
    CategoryPerformanceReportRequest,
    CategoryPerformanceReportResponse,
} from "@/types";
import { Box, Card, CardContent, Typography } from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { CategoryPerformanceChart } from "./CategoryPerformanceChart";
import { CategoryPerformanceGrid } from "./CategoryPerformanceGrid";

dayjs.extend(utc);

const breadcrums = [
  {
    label: "",
    href: "dashboard",
  },
  {
    label: "Báo cáo hiệu suất danh mục",
    href: "sale",
  },
];

export default async function CategoryPerformancePage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  let data: CategoryPerformanceReportResponse[] = [];
  const startDate = searchParams?.start_date
    ? dayjs.utc(searchParams?.start_date)
    : dayjs.utc().startOf("year");
  const endDate = searchParams?.end_date
    ? dayjs(searchParams?.end_date)
    : dayjs.utc().endOf("year");
  const request: CategoryPerformanceReportRequest = {
    startDate: startDate.toJSON(),
    endDate: endDate.toJSON(),
  };
  const response = await getListApi(API_URL.categoryPerformanceReport, request);
  if (response.success) {
    data = response.data as CategoryPerformanceReportResponse[];
  } else {
    console.error(
      "Error fetching category performance data:",
      response.message
    );
  }

  // Sort and get top 10 categories by revenue
  const top10Categories = data
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 10);

  return (
    <Box>
      <NavBreadcrumbs items={breadcrums} />
      <Typography variant="h4" gutterBottom>
        Báo cáo hiệu suất danh mục
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Top 10 danh mục theo doanh thu
          </Typography>
          <Box sx={{ width: "100%", height: 400 }}>
            <CategoryPerformanceChart data={top10Categories} />
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Chi tiết hiệu suất danh mục
          </Typography>
          <Box sx={{ height: 600, width: "100%" }}>
            <CategoryPerformanceGrid data={data} />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
