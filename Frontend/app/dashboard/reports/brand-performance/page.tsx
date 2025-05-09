import { API_URL } from "@/constant/apiUrl";
import { BrandPerformanceCardGrid } from "@/features/dashboard/reports/brand-performance/BrandPerformanceCardGrid";
import { BrandPerformanceChart } from "@/features/dashboard/reports/brand-performance/BrandPerformanceChart";
import { BrandPerformanceGrid } from "@/features/dashboard/reports/brand-performance/BrandPerformanceGrid";
import { getListApi } from "@/lib/apiClient";
import dayjs from "@/lib/extended-dayjs";
import {
  BrandPerformanceReportRequest,
  BrandPerformanceReportResponse,
  SearchParams,
} from "@/types";
import { Stack, Title } from "@mantine/core";
import { Dayjs } from "dayjs";

async function fetchBrandPerformanceData(startDate: Dayjs, endDate: Dayjs) {
  const request: BrandPerformanceReportRequest = {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  };
  const response = await getListApi(API_URL.brandPerformanceReport, request);
  if (response.success) {
    return response.data as BrandPerformanceReportResponse[];
  } else {
    console.error("Error fetching brand performance data:", response.message);
    return [];
  }
}

export default async function BrandPerformancePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { start_date, end_date } = await searchParams;
  const startDate = start_date ? dayjs(start_date) : dayjs().startOf("year");
  const endDate = end_date ? dayjs(end_date) : dayjs().endOf("year");
  const data = await fetchBrandPerformanceData(startDate, endDate);
  const topTenBrands = data
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 10);
  const highestBrand = data.sort((a, b) => b.totalRevenue - a.totalRevenue)[0];
  return (
    <Stack>
      <Title order={5}>Báo cáo hiệu suất thương hiệu</Title>
      <BrandPerformanceCardGrid highestBrand={highestBrand} />
      <Title order={6}>Top 10 thương hiệu theo doanh thu</Title>
      <BrandPerformanceChart data={topTenBrands} />
      <Title order={6}>Chi tiết</Title>
      <BrandPerformanceGrid data={data} />
    </Stack>
  );
}
