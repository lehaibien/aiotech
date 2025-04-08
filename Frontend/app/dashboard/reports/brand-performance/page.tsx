import NavBreadcrumbs from "@/components/core/NavBreadcrumbs";
import { API_URL } from "@/constant/apiUrl";
import { getListApi } from "@/lib/apiClient";
import {
    BrandPerformanceReportRequest,
    BrandPerformanceReportResponse,
} from "@/types";
import { Box, Card, CardContent, Typography } from "@mui/material";
import dayjs from "@/lib/extended-dayjs";
import utc from "dayjs/plugin/utc";
import { BrandPerformanceChart } from "./BrandPerformanceChart";
import { BrandPerformanceGrid } from "./BrandPerformanceGrid";

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

export default async function BrandPerformancePage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  let data: BrandPerformanceReportResponse[] = [];
  const startDate = searchParams?.start_date
    ? dayjs(searchParams?.start_date)
    : dayjs().startOf("year");
  const endDate = searchParams?.end_date
    ? dayjs(searchParams?.end_date)
    : dayjs().endOf("year");
  const request: BrandPerformanceReportRequest = {
    startDate: startDate.toJSON(),
    endDate: endDate.toJSON(),
  };
  const response = await getListApi(API_URL.brandPerformanceReport, request);
  if (response.success) {
    data = response.data as BrandPerformanceReportResponse[];
  } else {
    console.error(
      "Error fetching brand performance data:",
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
        Báo cáo hiệu suất thương hiệu
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Top 10 thương hiệu theo doanh thu
          </Typography>
          <Box sx={{ width: "100%", height: 400 }}>
            <BrandPerformanceChart data={top10Categories} />
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Chi tiết hiệu suất thương hiệu
          </Typography>
          <Box sx={{ height: 600, width: "100%" }}>
            <BrandPerformanceGrid data={data} />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
