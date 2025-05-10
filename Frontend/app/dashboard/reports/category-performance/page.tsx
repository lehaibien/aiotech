import { API_URL } from "@/constant/apiUrl";
import { CategoryPerformanceCardGrid } from "@/features/dashboard/reports/category-performance/CategoryPerformanceCardGrid";
import { CategoryPerformanceChart } from "@/features/dashboard/reports/category-performance/CategoryPerformanceChart";
import { CategoryPerformanceGrid } from "@/features/dashboard/reports/category-performance/CategoryPerformanceGrid";
import { getListApi } from "@/lib/apiClient";
import dayjs from "@/lib/extended-dayjs";
import {
  CategoryPerformanceReportRequest,
  CategoryPerformanceReportResponse,
  SearchParams,
} from "@/types";
import { Stack, Title } from "@mantine/core";
import { Dayjs } from "dayjs";

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

export default async function CategoryPerformancePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { start_date, end_date } = await searchParams;
  const startDate = start_date ? dayjs(start_date) : dayjs().startOf("year");
  const endDate = end_date ? dayjs(end_date) : dayjs().endOf("year");
  const data = await fetchCategoryPerformanceData(startDate, endDate);
  const top10Categories = data
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 10);
  const highestCategory = data.sort(
    (a, b) => b.totalRevenue - a.totalRevenue
  )[0];
  return (
    <Stack>
      <Title order={5}>Báo cáo hiệu suất danh mục</Title>
      <CategoryPerformanceCardGrid highestCategory={highestCategory} />
      <Title order={6}>Top 10 danh mục theo doanh thu</Title>
      <CategoryPerformanceChart data={top10Categories} />
      <Title order={6}>Chi tiết</Title>
      <CategoryPerformanceGrid data={data} />
    </Stack>
  );
}
