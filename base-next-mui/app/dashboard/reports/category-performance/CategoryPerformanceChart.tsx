"use client";

import NoRowOverlay from "@/components/core/NoRowOverlay";
import { CategoryPerformanceReportResponse } from "@/types";
import { BarChart } from "@mui/x-charts";

type CategoryPerformanceChartProps = {
  data: CategoryPerformanceReportResponse[];
};

export function CategoryPerformanceChart({
  data,
}: CategoryPerformanceChartProps) {
  const revenue = data.map((cat) => cat.totalRevenue);
  const unitsSold = data.map((cat) => cat.totalUnitsSold);
  return (
    <BarChart
      series={[
        {
          id: "revenue",
          data: revenue,
          label: "Doanh thu",
          type: "bar",
        },
        {
          id: "unitsSold",
          data: unitsSold,
          label: "Số lượng bán ra",
          type: "bar",
        },
      ]}
      xAxis={[
        {
          data: data.map((cat) => cat.categoryName),
          scaleType: "band",
        },
      ]}
      height={350}
      margin={{ left: 80, right: 80, top: 40, bottom: 40 }}
      slots={{
        noDataOverlay: NoRowOverlay,
      }}
    />
  );
}
