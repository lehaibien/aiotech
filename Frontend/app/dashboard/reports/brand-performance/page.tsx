import { API_URL } from "@/constant/apiUrl";
import { BrandPerformanceCardGrid } from "@/features/dashboard/reports/brand-performance/BrandPerformanceCardGrid";
import { BrandPerformanceChart } from "@/features/dashboard/reports/brand-performance/BrandPerformanceChart";
import { BrandPerformanceGrid } from "@/features/dashboard/reports/brand-performance/BrandPerformanceGrid";
import { getListApi } from "@/lib/apiClient";
import dayjs from "@/lib/extended-dayjs";
import {
  BrandPerformanceReportRequest,
  BrandPerformanceReportResponse,
} from "@/types";
import { Stack, Title } from "@mantine/core";

type SearchParams = Promise<{ [key: string]: string | undefined }>;

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
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
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
  const highestBrand = data.sort((a, b) => b.totalRevenue - a.totalRevenue)[0];
  return (
    <Stack>
      <Title order={5}>Báo cáo hiệu suất thương hiệu</Title>
      <BrandPerformanceCardGrid highestBrand={highestBrand} />
      <Stack>
        <Title order={6}>Top 10 thương hiệu theo doanh thu</Title>
        <BrandPerformanceChart data={top10Categories} />
      </Stack>
      <Stack>
        <Title order={6}>Chi tiết</Title>
        <BrandPerformanceGrid data={data} />
      </Stack>
    </Stack>
  );
}
