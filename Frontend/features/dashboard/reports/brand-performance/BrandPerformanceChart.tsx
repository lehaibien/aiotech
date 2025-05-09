"use client";

import { formatNumberWithSeperator } from "@/lib/utils";
import { BrandPerformanceReportResponse } from "@/types";
import { BarChart } from "@mantine/charts";

type BrandPerformanceChartProps = {
  data: BrandPerformanceReportResponse[];
};

export const BrandPerformanceChart = ({ data }: BrandPerformanceChartProps) => {
  return (
    <BarChart
      data={data}
      dataKey="brandName"
      h={350}
      series={[
        {
          name: "totalRevenue",
          label: "Doanh thu",
          color: "#4caf50",
        },
        {
          name: "totalUnitsSold",
          label: "Số lượng bán ra",
          color: "#2196f3",
        },
      ]}
      yAxisProps={{
        label: "Doanh thu (đ)",
      }}
      xAxisProps={{
        label: "Thương hiệu",
      }}
      valueFormatter={(value) =>
        value < 10000
          ? value.toString()
          : formatNumberWithSeperator(value) + "đ"
      }
      withLegend
    />
  );
};
