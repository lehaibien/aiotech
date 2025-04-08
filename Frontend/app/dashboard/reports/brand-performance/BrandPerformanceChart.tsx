"use client";

import NoRowOverlay from "@/components/core/NoRowOverlay";
import { BrandPerformanceReportResponse } from "@/types";
import { BarChart } from "@mui/x-charts";

type BrandPerformanceChartProps = {
  data: BrandPerformanceReportResponse[];
};

export function BrandPerformanceChart({
  data,
}: BrandPerformanceChartProps) {
  const revenue = data.map((brd) => brd.totalRevenue);
  const unitsSold = data.map((brd) => brd.totalUnitsSold);
  const names = data.map((brd) => brd.brandName);
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
          data: names,
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
